
declare module 'react-mathjax-preview'{
    import React from 'react'
    import mathjax from 'mathjax'

    class MathJaxPreview extends React.Component
    <{
        /*
        * URL to MAthJax script
        */
        script?: string,

        /*
        * MathJax config
        */
        config?: MathJax.Config,

        /*
        *
        */
        className?: string,

        /*
        * Math to preview
        */
        math: string,

        /*
        * CSS Styles
        */
        style?: React.CSSProperties
    }
    >{}
    export default MathJaxPreview
}
