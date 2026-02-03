import Text from "@tiptap/extension-text";
import Focus from "@tiptap/extension-focus";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import { TextStyleKit } from "@tiptap/extension-text-style";

import { DocumentExt } from "../exts/document";
import { ParagraphExt } from "../exts/paragraph";
import { HeadingExt } from "../exts/heading";
import { ColumnExt } from "../exts/column";
import { RowExt } from "../exts/row";
import { LinkExt } from "../exts/link";
import { ImageExt } from "../exts/image";
import { ChartExt } from "../exts/chart";
import { BulletListExt } from "../exts/bullet-list";
import { OrderedListExt } from "../exts/ordered-list";
import { ListItemExt } from "../exts/list-item";
import { NodeName } from "../slides.utils";

export const availableExtensions = [
  DocumentExt,
  Text,
  Focus,
  Bold,
  Italic,
  Strike,
  Underline,
  TextAlign.configure({
    types: [NodeName.HEADING, NodeName.PARAGRAPH],
  }),
  ParagraphExt,
  HeadingExt,
  ImageExt,
  ChartExt,
  ColumnExt,
  RowExt,
  LinkExt,
  BulletListExt,
  OrderedListExt,
  ListItemExt,
  TextStyleKit,
];
