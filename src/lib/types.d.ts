b;
/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

/**
 * This should be built in to Typescript from version 4.4 onwards
 */
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type EmojiBlock = {
	type: 'emoji';
	emoji: string;
};

export type ArticleStatus = 'Published' | 'Not Started';

export type Article = {
	archived: boolean;
	cover: any;
	created_time: string;
	icon: EmojiBlock;
	id: string;
	last_edited_time: string;
	object: 'page';
	url: string;
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
			multi_select: {
				id: string;
				name: string;
				color: string;
			}[];
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
	children?: BlockType[];
};

export type BlockContentProp<
	T = BlockName,
	P extends Record<string, unknown> = Record<string, never>
> = Record<T, BlockContent<P>>;

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
} & BlockContent<T, P>;

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
