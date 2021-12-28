/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

export type EmojiBlock = {
	type: 'emoji';
	emoji: string;
};

export type ArticleStatus = 'Published' | 'Not Started';

export type ArticleTag = {
	id: string;
	name: string;
	color: string;
};

export type Article = {
	object: 'page';
	id: string;
	created_time: string;
	last_edited_time: string;
	cover: null;
	archived?: boolean;
	url: `https://www.notion.so/${string}`;
	icon: EmojiBlock;
	parent: {
		database_id: string;
		type: 'database_id';
	};
	properties: {
		Name: NotionPageName;
		Status: {
			id: string;
			type: 'select';
			select: {
				id: string;
				name: ArticleStatus;
				color: string;
			};
		};
		Tags: {
			id: string;
			type: 'multi_select';
			multi_select: ArticleTag[];
		};
		Language: {
			id: 'R1%5CS';
			type: 'multi_select';
			multi_select: ArticleTag[];
		};
		'Related to Tasks (Articles)': {
			id: '%5D%3EHH';
			type: 'relation';
			relation: [];
		};
		Created: {
			id: 'nox2';
			type: 'created_time';
			created_time: string;
		};
		Path: {
			id: 'kQ%5C%3D';
			type: 'rich_text';
			rich_text: NotionTextObject[];
		};
	};
};

export type NotionPageName = {
	id: string;
	type: string;
	title: NotionTextObject[];
};

export type NotionTextLinkObject = {
	url: string;
} | null;

export type NotionTextObject = {
	annotations: {
		bold: boolean;
		code: boolean;
		color: string;
		italic: boolean;
		strikethrough: boolean;
		underline: boolean;
	};
	href: null;
	plain_text: string;
	type: 'text';
	text: {
		content: string;
		link: NotionTextLinkObject;
	};
};

export type BlockName =
	| 'callout'
	| 'heading_1'
	| 'heading_2'
	| 'heading_3'
	| 'paragraph'
	| 'numbered_list_item'
	| 'bulleted_list_item'
	| 'code'
	| 'to_do'
	| 'toggle'
	| 'child_page'
	| 'image'
	| 'embed'
	| 'video'
	| 'file'
	| 'pdf'
	| 'bookmark';

export type BlockContent<P extends Record<string, unknown> = Record<string, never>> = P & {
	text: NotionTextObject[];
	icon?: EmojiBlock;
	checked?: boolean;
	children?: BlockType<P>[];
};

/**
 * Generic Notion block type
 * @param P -- additional fields the block type can have
 */
export type BlockType<T = BlockName, P extends Record<string, unknown> = Record<string, never>> = {
	id: string;
	archived: boolean;
	created_time: string;
	has_children: boolean;
	last_edited_time: string;
	object: 'block';
	type: T;
} & BlockContent<P>;

export type CalloutBlock = BlockType<
	'callout',
	{
		icon: EmojiBlock;
	}
>;

export type CodeBlock = BlockType<
	'code',
	{
		language: string;
	}
>;

export type BlockWithChildren = BlockType<
	BlockName,
	{
		children?: BlockType;
	}
>;

export type ImageBlock = BlockType<
	'image',
	{
		caption: string[];
		file: {
			expiry_time: string;
			url: string;
		};
	}
>;
