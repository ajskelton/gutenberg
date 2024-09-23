/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	AutosaveMonitor,
	LocalAutosaveMonitor,
	UnsavedChangesWarning,
	EditorKeyboardShortcutsRegister,
	EditorSnackbars,
	ErrorBoundary,
	PostLockedModal,
	store as editorStore,
	privateApis as editorPrivateApis,
} from '@wordpress/editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	privateApis as blockEditorPrivateApis,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PluginArea } from '@wordpress/plugins';
import { __, sprintf } from '@wordpress/i18n';
import {
	useCallback,
	useMemo,
	useId,
	useRef,
	useState,
} from '@wordpress/element';
import { chevronDown, chevronUp } from '@wordpress/icons';
import { store as noticesStore } from '@wordpress/notices';
import { store as preferencesStore } from '@wordpress/preferences';
import {
	CommandMenu,
	privateApis as commandsPrivateApis,
} from '@wordpress/commands';
import { privateApis as coreCommandsPrivateApis } from '@wordpress/core-commands';
import { privateApis as blockLibraryPrivateApis } from '@wordpress/block-library';
import { addQueryArgs } from '@wordpress/url';
import { decodeEntities } from '@wordpress/html-entities';
import { store as coreStore } from '@wordpress/core-data';
import {
	Icon,
	SlotFillProvider,
	Tooltip,
	VisuallyHidden,
} from '@wordpress/components';
import {
	__experimentalUseDragging as useDragging,
	useMediaQuery,
	useRefEffect,
	useViewportMatch,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BackButton from '../back-button';
import EditorInitialization from '../editor-initialization';
import EditPostKeyboardShortcuts from '../keyboard-shortcuts';
import InitPatternModal from '../init-pattern-modal';
import BrowserURL from '../browser-url';
import MetaBoxes from '../meta-boxes';
import PostEditorMoreMenu from '../more-menu';
import WelcomeGuide from '../welcome-guide';
import { store as editPostStore } from '../../store';
import { unlock } from '../../lock-unlock';
import useEditPostCommands from '../../commands/use-commands';
import { usePaddingAppender } from './use-padding-appender';
import { useShouldIframe } from './use-should-iframe';
import useNavigateToEntityRecord from '../../hooks/use-navigate-to-entity-record';

const { getLayoutStyles } = unlock( blockEditorPrivateApis );
const { useCommands } = unlock( coreCommandsPrivateApis );
const { useCommandContext } = unlock( commandsPrivateApis );
const { Editor, FullscreenMode } = unlock( editorPrivateApis );
const { BlockKeyboardShortcuts } = unlock( blockLibraryPrivateApis );
const DESIGN_POST_TYPES = [
	'wp_template',
	'wp_template_part',
	'wp_block',
	'wp_navigation',
];

function useEditorStyles() {
	const {
		hasThemeStyleSupport,
		editorSettings,
		isZoomedOutView,
		renderingMode,
		postType,
	} = useSelect( ( select ) => {
		const { __unstableGetEditorMode } = select( blockEditorStore );
		const { getCurrentPostType, getRenderingMode } = select( editorStore );
		const _postType = getCurrentPostType();
		return {
			hasThemeStyleSupport:
				select( editPostStore ).isFeatureActive( 'themeStyles' ),
			editorSettings: select( editorStore ).getEditorSettings(),
			isZoomedOutView: __unstableGetEditorMode() === 'zoom-out',
			renderingMode: getRenderingMode(),
			postType: _postType,
		};
	}, [] );

	// Compute the default styles.
	return useMemo( () => {
		const presetStyles =
			editorSettings.styles?.filter(
				( style ) =>
					style.__unstableType && style.__unstableType !== 'theme'
			) ?? [];

		const defaultEditorStyles = [
			...( editorSettings?.defaultEditorStyles ?? [] ),
			...presetStyles,
		];

		// Has theme styles if the theme supports them and if some styles were not preset styles (in which case they're theme styles).
		const hasThemeStyles =
			hasThemeStyleSupport &&
			presetStyles.length !== ( editorSettings.styles?.length ?? 0 );

		// If theme styles are not present or displayed, ensure that
		// base layout styles are still present in the editor.
		if ( ! editorSettings.disableLayoutStyles && ! hasThemeStyles ) {
			defaultEditorStyles.push( {
				css: getLayoutStyles( {
					style: {},
					selector: 'body',
					hasBlockGapSupport: false,
					hasFallbackGapSupport: true,
					fallbackGapValue: '0.5em',
				} ),
			} );
		}

		const baseStyles = hasThemeStyles
			? editorSettings.styles ?? []
			: defaultEditorStyles;

		// Add a space for the typewriter effect. When typing in the last block,
		// there needs to be room to scroll up.
		if (
			! isZoomedOutView &&
			renderingMode === 'post-only' &&
			! DESIGN_POST_TYPES.includes( postType )
		) {
			return [
				...baseStyles,
				{
					css: ':root :where(.editor-styles-wrapper)::after {content: ""; display: block; height: 40vh;}',
				},
			];
		}

		return baseStyles;
	}, [
		editorSettings.defaultEditorStyles,
		editorSettings.disableLayoutStyles,
		editorSettings.styles,
		hasThemeStyleSupport,
		postType,
	] );
}

/**
 * @param {Object}  props
 * @param {boolean} props.isLegacy True when the editor canvas is not in an iframe.
 */
function MetaBoxesMain( { isLegacy } ) {
	const [ isOpen, openHeight, hasAnyVisible ] = useSelect( ( select ) => {
		const { get } = select( preferencesStore );
		const { isMetaBoxLocationVisible } = select( editPostStore );
		return [
			get( 'core/edit-post', 'metaBoxesMainIsOpen' ),
			get( 'core/edit-post', 'metaBoxesMainOpenHeight' ),
			isMetaBoxLocationVisible( 'normal' ) ||
				isMetaBoxLocationVisible( 'advanced' ) ||
				isMetaBoxLocationVisible( 'side' ),
		];
	}, [] );
	const { set: setPreference } = useDispatch( preferencesStore );
	const metaBoxesMainRef = useRef();
	const isShort = useMediaQuery( '(max-height: 549px)' );

	const [ { min, max }, setHeightConstraints ] = useState( () => ( {} ) );
	// Keeps the resizable area’s size constraints updated taking into account
	// editor notices. The constraints are also used to derive the value for the
	// aria-valuenow attribute on the seperator.
	const effectSizeConstraints = useRefEffect( ( node ) => {
		const container = node.closest(
			'.interface-interface-skeleton__content'
		);
		const noticeLists = container.querySelectorAll(
			':scope > .components-notice-list'
		);
		const resizeHandle = container.querySelector(
			'.edit-post-meta-boxes-main__presenter'
		);
		const actualize = () => {
			const fullHeight = container.offsetHeight;
			let nextMax = fullHeight;
			for ( const element of noticeLists ) {
				nextMax -= element.offsetHeight;
			}
			const nextMin = resizeHandle.offsetHeight;
			setHeightConstraints( { min: nextMin, max: nextMax } );
		};
		const observer = new window.ResizeObserver( actualize );
		observer.observe( container );
		for ( const element of noticeLists ) {
			observer.observe( element );
		}
		return () => observer.disconnect();
	}, [] );

	const separatorRef = useRef();
	const separatorHelpId = useId();

	const heightRef = useRef();
	const actualizeHeight = ( candidateHeight, isPersistent ) => {
		const nextHeight = Math.min( max, Math.max( min, candidateHeight ) );
		if ( isPersistent ) {
			heightRef.current = nextHeight;
			setPreference(
				'core/edit-post',
				'metaBoxesMainOpenHeight',
				nextHeight
			);
		} else {
			// Keeps the unconstrained height for subsequent calculations so that when
			// dragging takes the height out of range and the cursor detaches from its
			// initial position relative to the drag handle, any movement back toward the
			// range is absorbed without affecting the applied height as that would
			// otherwise maintain the cursor’s detachment.
			heightRef.current = candidateHeight;
			metaBoxesMainRef.current.style.height = `${ nextHeight }px`;
			separatorRef.current.ariaValueNow = getAriaValueNow( nextHeight );
		}
	};
	const { startDrag, endDrag, isDragging } = useDragging( {
		onDragStart: () => {
			if ( isAutoHeight || heightRef.current === undefined ) {
				// Sets the starting height to avoid visual jumps in height and
				// aria-valuenow being `NaN` for the first (few) resize events.
				actualizeHeight( metaBoxesMainRef.current.offsetHeight );
			} else if ( heightRef.current > max ) {
				// Starts from max in case shortening the window has imposed it.
				actualizeHeight( max );
			}
		},
		onDragMove: ( { movementY } ) =>
			actualizeHeight( heightRef.current - movementY ),
		onDragEnd: () => actualizeHeight( heightRef.current, true ),
	} );

	if ( ! hasAnyVisible ) {
		return;
	}

	const contents = (
		<div
			className={ clsx(
				// The class name 'edit-post-layout__metaboxes' is retained because some plugins use it.
				'edit-post-layout__metaboxes',
				! isLegacy && 'edit-post-meta-boxes-main__liner'
			) }
		>
			<MetaBoxes location="normal" />
			<MetaBoxes location="advanced" />
		</div>
	);

	if ( isLegacy ) {
		return contents;
	}

	const isAutoHeight = openHeight === undefined;
	let usedMax = '50%'; // Approximation before max has a value.
	if ( max !== undefined ) {
		// Halves the available max height until a user height is set.
		usedMax = isAutoHeight && ! isDragging ? max / 2 : max;
	}

	const getAriaValueNow = ( height ) =>
		Math.round( ( ( height - min ) / ( max - min ) ) * 100 );
	const usedAriaValueNow =
		max === undefined || isAutoHeight ? 50 : getAriaValueNow( openHeight );

	const toggle = () =>
		setPreference( 'core/edit-post', 'metaBoxesMainIsOpen', ! isOpen );

	// TODO: Support more/all keyboard interactions from the window splitter pattern:
	// https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
	const onSeparatorKeyDown = ( event ) => {
		const delta = { ArrowUp: 20, ArrowDown: -20 }[ event.key ];
		if ( delta ) {
			const pane = metaBoxesMainRef.current;
			const fromHeight = isAutoHeight ? pane.offsetHeight : openHeight;
			actualizeHeight( delta + fromHeight, true );
			event.preventDefault();
		}
	};
	const className = 'edit-post-meta-boxes-main';
	const paneLabel = __( 'Meta Boxes' );
	let paneProps, paneButtonProps;
	if ( isShort ) {
		paneProps = {
			className: clsx( className, 'is-toggle-only', isOpen && 'is-open' ),
		};
		paneButtonProps = {
			'aria-label': __( 'Expand or collapse meta boxes pane' ),
			onClick: toggle,
			children: (
				<>
					{ paneLabel }
					<Icon icon={ isOpen ? chevronUp : chevronDown } />
				</>
			),
		};
	} else {
		paneProps = {
			ref: metaBoxesMainRef,
			className: clsx( className, 'is-resizable' ),
			style: { height: openHeight, maxHeight: usedMax },
		};
		paneButtonProps = {
			ref: separatorRef,
			role: 'separator',
			'aria-valuenow': usedAriaValueNow,
			'aria-label': __( 'Drag to resize' ),
			'aria-describedby': separatorHelpId,
			onKeyDown: onSeparatorKeyDown,
			onMouseDown: startDrag,
			onMouseUp: endDrag,
			// Avoids hiccups while dragging over objects like iframes and ensures that
			// the event to end the drag is captured by the target (resize handle)
			// whether or not it’s under the pointer.
			onPointerDown: ( { pointerId, target } ) => {
				target.setPointerCapture( pointerId );
			},
			children: (
				<Tooltip text={ __( 'Drag to resize' ) }>
					<div tabIndex={ -1 }>
						<VisuallyHidden id={ separatorHelpId }>
							{ __(
								'Use up and down arrow keys to resize the metabox pane.'
							) }
						</VisuallyHidden>
					</div>
				</Tooltip>
			),
		};
	}

	return (
		<aside aria-label={ paneLabel } { ...paneProps }>
			{ ! isShort && <meta ref={ effectSizeConstraints } /> }
			<button
				className="edit-post-meta-boxes-main__presenter"
				{ ...paneButtonProps }
			/>
			{ contents }
		</aside>
	);
}

function Layout( {
	postId: initialPostId,
	postType: initialPostType,
	settings,
	initialEdits,
} ) {
	useCommands();
	useEditPostCommands();
	const paddingAppenderRef = usePaddingAppender();
	const shouldIframe = useShouldIframe();
	const { createErrorNotice } = useDispatch( noticesStore );
	const {
		currentPost,
		onNavigateToEntityRecord,
		onNavigateToPreviousEntityRecord,
	} = useNavigateToEntityRecord(
		initialPostId,
		initialPostType,
		'post-only'
	);
	const {
		mode,
		isFullscreenActive,
		hasActiveMetaboxes,
		hasBlockSelected,
		showIconLabels,
		isDistractionFree,
		showMetaBoxes,
		hasHistory,
		isEditingTemplate,
		isWelcomeGuideVisible,
		templateId,
	} = useSelect(
		( select ) => {
			const { get } = select( preferencesStore );
			const { isFeatureActive, getEditedPostTemplateId } = unlock(
				select( editPostStore )
			);
			const { canUser, getPostType } = select( coreStore );

			const supportsTemplateMode = settings.supportsTemplateMode;
			const isViewable =
				getPostType( currentPost.postType )?.viewable ?? false;
			const canViewTemplate = canUser( 'read', {
				kind: 'postType',
				name: 'wp_template',
			} );

			return {
				mode: select( editorStore ).getEditorMode(),
				isFullscreenActive:
					select( editPostStore ).isFeatureActive( 'fullscreenMode' ),
				hasActiveMetaboxes: select( editPostStore ).hasMetaBoxes(),
				hasBlockSelected:
					!! select( blockEditorStore ).getBlockSelectionStart(),
				showIconLabels: get( 'core', 'showIconLabels' ),
				isDistractionFree: get( 'core', 'distractionFree' ),
				showMetaBoxes:
					select( editorStore ).getRenderingMode() === 'post-only',
				isEditingTemplate:
					select( editorStore ).getCurrentPostType() ===
					'wp_template',
				isWelcomeGuideVisible: isFeatureActive( 'welcomeGuide' ),
				templateId:
					supportsTemplateMode &&
					isViewable &&
					canViewTemplate &&
					currentPost.postType !== 'wp_template'
						? getEditedPostTemplateId()
						: null,
			};
		},
		[ settings.supportsTemplateMode, currentPost.postType ]
	);

	// Set the right context for the command palette
	const commandContext = hasBlockSelected
		? 'block-selection-edit'
		: 'entity-edit';
	useCommandContext( commandContext );
	const editorSettings = useMemo(
		() => ( {
			...settings,
			onNavigateToEntityRecord,
			onNavigateToPreviousEntityRecord,
			defaultRenderingMode: 'post-only',
		} ),
		[ settings, onNavigateToEntityRecord, onNavigateToPreviousEntityRecord ]
	);
	const styles = useEditorStyles();

	// We need to add the show-icon-labels class to the body element so it is applied to modals.
	if ( showIconLabels ) {
		document.body.classList.add( 'show-icon-labels' );
	} else {
		document.body.classList.remove( 'show-icon-labels' );
	}

	const className = clsx( 'edit-post-layout', 'is-mode-' + mode, {
		'has-metaboxes': hasActiveMetaboxes,
	} );

	function onPluginAreaError( name ) {
		createErrorNotice(
			sprintf(
				/* translators: %s: plugin name */
				__(
					'The "%s" plugin has encountered an error and cannot be rendered.'
				),
				name
			)
		);
	}

	const { createSuccessNotice } = useDispatch( noticesStore );

	const onActionPerformed = useCallback(
		( actionId, items ) => {
			switch ( actionId ) {
				case 'move-to-trash':
					{
						document.location.href = addQueryArgs( 'edit.php', {
							trashed: 1,
							post_type: items[ 0 ].type,
							ids: items[ 0 ].id,
						} );
					}
					break;
				case 'duplicate-post':
					{
						const newItem = items[ 0 ];
						const title =
							typeof newItem.title === 'string'
								? newItem.title
								: newItem.title?.rendered;
						createSuccessNotice(
							sprintf(
								// translators: %s: Title of the created post e.g: "Post 1".
								__( '"%s" successfully created.' ),
								decodeEntities( title )
							),
							{
								type: 'snackbar',
								id: 'duplicate-post-action',
								actions: [
									{
										label: __( 'Edit' ),
										onClick: () => {
											const postId = newItem.id;
											document.location.href =
												addQueryArgs( 'post.php', {
													post: postId,
													action: 'edit',
												} );
										},
									},
								],
							}
						);
					}
					break;
			}
		},
		[ createSuccessNotice ]
	);

	const initialPost = useMemo( () => {
		return {
			type: initialPostType,
			id: initialPostId,
		};
	}, [ initialPostType, initialPostId ] );

	const backButton =
		useViewportMatch( 'medium' ) && isFullscreenActive ? (
			<BackButton initialPost={ initialPost } />
		) : null;

	return (
		<SlotFillProvider>
			<ErrorBoundary>
				<CommandMenu />
				<WelcomeGuide postType={ currentPost.postType } />
				<Editor
					settings={ editorSettings }
					initialEdits={ initialEdits }
					postType={ currentPost.postType }
					postId={ currentPost.postId }
					templateId={ templateId }
					className={ className }
					styles={ styles }
					forceIsDirty={ hasActiveMetaboxes }
					contentRef={ paddingAppenderRef }
					disableIframe={ ! shouldIframe }
					// We should auto-focus the canvas (title) on load.
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={ ! isWelcomeGuideVisible }
					onActionPerformed={ onActionPerformed }
					extraSidebarPanels={
						! isEditingTemplate && <MetaBoxes location="side" />
					}
					extraContent={
						! isDistractionFree &&
						showMetaBoxes && (
							<MetaBoxesMain isLegacy={ ! shouldIframe } />
						)
					}
				>
					<PostLockedModal />
					<EditorInitialization />
					<FullscreenMode isActive={ isFullscreenActive } />
					<BrowserURL hasHistory={ hasHistory } />
					<UnsavedChangesWarning />
					<AutosaveMonitor />
					<LocalAutosaveMonitor />
					<EditPostKeyboardShortcuts />
					<EditorKeyboardShortcutsRegister />
					<BlockKeyboardShortcuts />
					<InitPatternModal />
					<PluginArea onError={ onPluginAreaError } />
					<PostEditorMoreMenu />
					{ backButton }
					<EditorSnackbars />
				</Editor>
			</ErrorBoundary>
		</SlotFillProvider>
	);
}

export default Layout;
