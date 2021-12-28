<script lang="ts">
  import Prism from 'prismjs'
  import type { BlockContent, CodeBlock } from "$lib/types";
  import 'prismjs/themes/prism-funky.css'

  export let content: BlockContent<CodeBlock>    
  
  let source = content.text.reduce((acc, { text }) => {
    if (Array.isArray(text?.content)) {
      return `${acc}${text.content.join("\n")}`
    }
    return `${acc}${text.content}`
  }, '')
  
  let grammer = Prism.languages[content.language]
  let formatted = Prism.highlight(source, grammer, content.language)
</script>

<pre class="language-{content.language}" command-line data-output="2-17">
  <code class="language-{content.language}">
    {@html formatted}
  </code>
</pre>

<style>
  pre[class*="language-"] {
    padding: unset;
    margin: unset;
  }
  code[class*="language-"] {
    background: unset;
    box-shadow: unset;
  }
</style>