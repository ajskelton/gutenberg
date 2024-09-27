"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[9170],{"./packages/components/src/utils/config-values.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _space__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/src/utils/space.ts"),_colors_values__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/components/src/utils/colors-values.js");const CONTROL_PROPS={controlPaddingX:12,controlPaddingXSmall:8,controlPaddingXLarge:12*1.3334,controlBackgroundColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,controlBoxShadowFocus:`0 0 0 0.5px ${_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.theme.accent}`,controlHeight:"36px",controlHeightXSmall:"calc( 36px * 0.6 )",controlHeightSmall:"calc( 36px * 0.8 )",controlHeightLarge:"calc( 36px * 1.2 )",controlHeightXLarge:"calc( 36px * 1.4 )"},__WEBPACK_DEFAULT_EXPORT__=Object.assign({},CONTROL_PROPS,{colorDivider:"rgba(0, 0, 0, 0.1)",colorScrollbarThumb:"rgba(0, 0, 0, 0.2)",colorScrollbarThumbHover:"rgba(0, 0, 0, 0.5)",colorScrollbarTrack:"rgba(0, 0, 0, 0.04)",elevationIntensity:1,radiusXSmall:"1px",radiusSmall:"2px",radiusMedium:"4px",radiusLarge:"8px",radiusFull:"9999px",radiusRound:"50%",borderWidth:"1px",borderWidthFocus:"1.5px",borderWidthTab:"4px",spinnerSize:16,fontSize:"13px",fontSizeH1:"calc(2.44 * 13px)",fontSizeH2:"calc(1.95 * 13px)",fontSizeH3:"calc(1.56 * 13px)",fontSizeH4:"calc(1.25 * 13px)",fontSizeH5:"13px",fontSizeH6:"calc(0.8 * 13px)",fontSizeInputMobile:"16px",fontSizeMobile:"15px",fontSizeSmall:"calc(0.92 * 13px)",fontSizeXSmall:"calc(0.75 * 13px)",fontLineHeightBase:"1.4",fontWeight:"normal",fontWeightHeading:"600",gridBase:"4px",cardPaddingXSmall:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(2)}`,cardPaddingSmall:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(4)}`,cardPaddingMedium:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(4)} ${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(6)}`,cardPaddingLarge:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(6)} ${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(8)}`,elevationXSmall:"0 1px 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02), 0 3px 3px rgba(0, 0, 0, 0.02), 0 4px 4px rgba(0, 0, 0, 0.01)",elevationSmall:"0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 3px rgba(0, 0, 0, 0.04), 0 6px 6px rgba(0, 0, 0, 0.03), 0 8px 8px rgba(0, 0, 0, 0.02)",elevationMedium:"0 2px 3px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.04), 0 12px 12px rgba(0, 0, 0, 0.03), 0 16px 16px rgba(0, 0, 0, 0.02)",elevationLarge:"0 5px 15px rgba(0, 0, 0, 0.08), 0 15px 27px rgba(0, 0, 0, 0.07), 0 30px 36px rgba(0, 0, 0, 0.04), 0 50px 43px rgba(0, 0, 0, 0.02)",surfaceBackgroundColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,surfaceBackgroundSubtleColor:"#F3F3F3",surfaceBackgroundTintColor:"#F5F5F5",surfaceBorderColor:"rgba(0, 0, 0, 0.1)",surfaceBorderBoldColor:"rgba(0, 0, 0, 0.15)",surfaceBorderSubtleColor:"rgba(0, 0, 0, 0.05)",surfaceBackgroundTertiaryColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,surfaceColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,transitionDuration:"200ms",transitionDurationFast:"160ms",transitionDurationFaster:"120ms",transitionDurationFastest:"100ms",transitionTimingFunction:"cubic-bezier(0.08, 0.52, 0.52, 1)",transitionTimingFunctionControl:"cubic-bezier(0.12, 0.8, 0.32, 1)"})},"./packages/components/src/utils/space.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>space});const GRID_BASE="4px";function space(value){if(void 0===value)return;if(!value)return"0";const asInt="number"==typeof value?value:Number(value);return"undefined"!=typeof window&&window.CSS?.supports?.("margin",value.toString())||Number.isNaN(asInt)?value.toString():`calc(${GRID_BASE} * ${value})`}},"./packages/components/src/progress-bar/stories/index.story.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,WithCustomWidth:()=>WithCustomWidth,default:()=>index_story});var build_module=__webpack_require__("./packages/i18n/build-module/index.js"),react=__webpack_require__("./node_modules/react/index.js"),emotion_styled_base_browser_esm=__webpack_require__("./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js"),emotion_react_browser_esm=__webpack_require__("./node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),config_values=__webpack_require__("./packages/components/src/utils/config-values.js"),colors_values=__webpack_require__("./packages/components/src/utils/colors-values.js");function animateProgressBar(isRtl=!1){const animationDirection=isRtl?"right":"left";return(0,emotion_react_browser_esm.F4)({"0%":{[animationDirection]:"-50%"},"100%":{[animationDirection]:"100%"}})}const Track=(0,emotion_styled_base_browser_esm.Z)("div",{target:"e15u147w2"})("position:relative;overflow:hidden;height:",config_values.Z.borderWidthFocus,";background-color:color-mix(\n\t\tin srgb,\n\t\t",colors_values.D.theme.foreground,",\n\t\ttransparent 90%\n\t);border-radius:",config_values.Z.radiusFull,";outline:2px solid transparent;outline-offset:2px;:where( & ){width:160px;}");var _ref={name:"152sa26",styles:"width:var(--indicator-width);transition:width 0.4s ease-in-out"};const Indicator=(0,emotion_styled_base_browser_esm.Z)("div",{target:"e15u147w1"})("display:inline-block;position:absolute;top:0;height:100%;border-radius:",config_values.Z.radiusFull,";background-color:color-mix(\n\t\tin srgb,\n\t\t",colors_values.D.theme.foreground,",\n\t\ttransparent 10%\n\t);outline:2px solid transparent;outline-offset:-2px;",(({isIndeterminate})=>isIndeterminate?(0,emotion_react_browser_esm.iv)({animationDuration:"1.5s",animationTimingFunction:"ease-in-out",animationIterationCount:"infinite",animationName:animateProgressBar((0,build_module.dZ)()),width:"50%"},"",""):_ref),";"),ProgressElement=(0,emotion_styled_base_browser_esm.Z)("progress",{target:"e15u147w0"})({name:"11fb690",styles:"position:absolute;top:0;left:0;opacity:0;width:100%;height:100%"});var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function UnforwardedProgressBar(props,ref){const{className,value,...progressProps}=props,isIndeterminate=!Number.isFinite(value);return(0,jsx_runtime.jsxs)(Track,{className,children:[(0,jsx_runtime.jsx)(Indicator,{style:{"--indicator-width":isIndeterminate?void 0:`${value}%`},isIndeterminate}),(0,jsx_runtime.jsx)(ProgressElement,{max:100,value,"aria-label":(0,build_module.__)("Loading …"),ref,...progressProps})]})}UnforwardedProgressBar.displayName="UnforwardedProgressBar";const ProgressBar=(0,react.forwardRef)(UnforwardedProgressBar);try{ProgressBar.displayName="ProgressBar",ProgressBar.__docgenInfo={description:"A simple horizontal progress bar component.\n\nSupports two modes: determinate and indeterminate. A progress bar is determinate\nwhen a specific progress value has been specified (from 0 to 100), and indeterminate\nwhen a value hasn't been specified.\n\n```jsx\nimport { ProgressBar } from '@wordpress/components';\n\nconst MyLoadingComponent = () => {\n\treturn <ProgressBar />;\n};\n```",displayName:"ProgressBar",props:{value:{defaultValue:null,description:"Value of the progress bar.",name:"value",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"A CSS class to apply to the progress bar wrapper (track) element.",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/progress-bar/index.tsx#ProgressBar"]={docgenInfo:ProgressBar.__docgenInfo,name:"ProgressBar",path:"packages/components/src/progress-bar/index.tsx#ProgressBar"})}catch(__react_docgen_typescript_loader_error){}try{progressbar.displayName="progressbar",progressbar.__docgenInfo={description:"A simple horizontal progress bar component.\n\nSupports two modes: determinate and indeterminate. A progress bar is determinate\nwhen a specific progress value has been specified (from 0 to 100), and indeterminate\nwhen a value hasn't been specified.\n\n```jsx\nimport { ProgressBar } from '@wordpress/components';\n\nconst MyLoadingComponent = () => {\n\treturn <ProgressBar />;\n};\n```",displayName:"progressbar",props:{value:{defaultValue:null,description:"Value of the progress bar.",name:"value",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"A CSS class to apply to the progress bar wrapper (track) element.",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/progress-bar/index.tsx#progressbar"]={docgenInfo:progressbar.__docgenInfo,name:"progressbar",path:"packages/components/src/progress-bar/index.tsx#progressbar"})}catch(__react_docgen_typescript_loader_error){}const index_story={component:ProgressBar,title:"Components/ProgressBar",argTypes:{value:{control:{type:"number",min:0,max:100,step:1}}},parameters:{sourceLink:"packages/components/src/progress-bar",badges:[],controls:{expanded:!0},docs:{canvas:{sourceState:"shown"}}}},Template=({...args})=>(0,jsx_runtime.jsx)(ProgressBar,{...args});Template.displayName="Template";const Default=Template.bind({});Default.args={};const WithCustomWidth=Template.bind({});WithCustomWidth.args={className:"custom-progress-bar"},WithCustomWidth.decorators=[Story=>(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("style",{children:"\n    .custom-progress-bar {\n        width: 100%;\n    }\n"}),(0,jsx_runtime.jsx)(Story,{})]})],Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"({\n  ...args\n}) => {\n  return <ProgressBar {...args} />;\n}",...Default.parameters?.docs?.source}}},WithCustomWidth.parameters={...WithCustomWidth.parameters,docs:{...WithCustomWidth.parameters?.docs,source:{originalSource:"({\n  ...args\n}) => {\n  return <ProgressBar {...args} />;\n}",...WithCustomWidth.parameters?.docs?.source},description:{story:"A progress bar with a custom width.\n\nYou can override the default `width` by passing a custom CSS class via the\n`className` prop.\n\nThis example shows a progress bar with an overriden `width` of `100%` which\nmakes it fit all available horizontal space of the parent element. The CSS\nclass looks like this:\n\n```css\n.custom-progress-bar {\n  width: 100%;\n}\n```",...WithCustomWidth.parameters?.docs?.description}}};try{WithCustomWidth.displayName="WithCustomWidth",WithCustomWidth.__docgenInfo={description:"A progress bar with a custom width.\n\nYou can override the default `width` by passing a custom CSS class via the\n`className` prop.\n\nThis example shows a progress bar with an overriden `width` of `100%` which\nmakes it fit all available horizontal space of the parent element. The CSS\nclass looks like this:\n\n```css\n.custom-progress-bar {\n  width: 100%;\n}\n```",displayName:"WithCustomWidth",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/progress-bar/stories/index.story.tsx#WithCustomWidth"]={docgenInfo:WithCustomWidth.__docgenInfo,name:"WithCustomWidth",path:"packages/components/src/progress-bar/stories/index.story.tsx#WithCustomWidth"})}catch(__react_docgen_typescript_loader_error){}}}]);