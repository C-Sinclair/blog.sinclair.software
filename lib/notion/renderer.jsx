/**
 * Type imports
 * @typedef {import('../types').Block} Block
 * @typedef {import('../types').BlockName} BlockName
 * @typedef {import('../types').BlockContent} BlockContent
 * @typedef {import('../types').NotionTextObject} NotionTextObject
 * @typedef {import('../types').NotionTextLinkObject} NotionTextLinkObject
 */
import { Fragment } from "react";

/**
 * Renders a Notion Block into Jsx components
 * @param {Block} block
 */
export function renderBlock(block) {
  /** @type {BlockName} */
  const type = block.type;
  const content = block[type];
  switch (type) {
    case "paragraph":
      return <Paragraph content={content} />;
    case "heading_1":
      return <H1 content={content} />;
    case "heading_2":
      return <H2 content={content} />;
    case "heading_3":
      return <H3 content={content} />;
    case "callout":
      return <Callout content={content} />;
    case "bulleted_list_item":
      return <BulletListItem content={content} />;
    case "numbered_list_item":
      return <NumberedListItem content={content} />;
    case "to_do":
      return <ToDo content={content} />;
    case "toggle":
      return <Toggle content={content} />;
    case "code":
      return <Code content={content} />;
  }
}

/**
 * @param {Object} props
 * @param {NotionTextLinkObject} props.link
 * @param {import('react').ReactNode} props.children
 */
function Anchor({ children, link }) {
  if (link) {
    return <a href={link.url}>{children}</a>;
  }
  return <>{children}</>;
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function Paragraph({ content }) {
  return (
    <p>
      {content.text.map(({ text, annotations }) => (
        <Anchor link={text.link}>
          {annotations.code ? <code>{text.content}</code> : text.content}
        </Anchor>
      ))}
    </p>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function H1({ content }) {
  return (
    <>
      {content.text.map(({ text }) => (
        <Anchor link={text.link}>
          <h1>{text.content}</h1>
        </Anchor>
      ))}
    </>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function H2({ content }) {
  return (
    <>
      {content.text.map(({ text }) => (
        <Anchor link={text.link}>
          <h2>{text.content}</h2>
        </Anchor>
      ))}
    </>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function H3({ content }) {
  return (
    <>
      {content.text.map(({ text }) => (
        <Anchor link={text.link}>
          <h3>{text.content}</h3>
        </Anchor>
      ))}
    </>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function Callout({ content }) {
  return (
    <section className="callout">
      {content.icon && <span className="emoji">{content.icon.emoji}</span>}
      <span className="text">
        <p>{content.text.map(({ text, annotations }) => annotations.code 
          ? <code>{text.content}</code> : text.content
        )}</p>
      </span>
    </section>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function BulletListItem({ content }) {
  return (
    <li>
      {content.text.map(({ text }) => (
        <Anchor link={text.link}>{text.content}</Anchor>
      ))}
    </li>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function NumberedListItem({ content }) {
  return (
    <li>
      {content.text.map(({ text }) => (
        <Anchor link={text.link}>{text.content}</Anchor>
      ))}
    </li>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 * @param {string} props.id
 */
function ToDo({ content, id }) {
  return (
    <div>
      <label htmlFor={id}>
        <input type="checkbox" id={id} defaultChecked={content.checked} />{" "}
        {content.text}
      </label>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function Toggle({ content }) {
  return (
    <details>
      <summary>{content.text}</summary>
      {content.children?.map((block) => (
        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
      ))}
    </details>
  );
}

/**
 * @param {Object} props
 * @param {BlockContent} props.content
 */
function Code({ content }) {
  return (
    <pre>
      <code>{content.text.map(({ text }) => text.content).join("\n")}</code>
    </pre>
  );
}
