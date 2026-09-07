export interface InstagramPost {
  created_at: string;
  caption: string;
  tags: string[];
  location: string;
  images: string[];
  url: string;
}

export interface InstagramContentItem {
  frontmatter: InstagramPost;
  url: string;
}
