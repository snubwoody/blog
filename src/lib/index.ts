
// TODO add a test to see if the api is up
export const apiUrl = "https://wakus-blog-backend.fly.dev";
export const apiV1 = `${apiUrl}/api/v1`;

export type Frontmatter = {
    title: string
    author: string
    /** The date the post was published */
    published: string
    /** A short description of the post */
    synopsis: string
    image: string
    imageSize: number
    file: string
    url: string
    tags: string[],
    /** If true then these posts will be left out */
    preview?: boolean
};

export type BlogPost = {
    url: string
    frontmatter: Frontmatter
};

/**
 * Get all the articles in the `/blog` directory with the `preview`
 * field set to false.
 *
 * @returns a list of all the articles
 */
export const getPosts = (): BlogPost[] => {
    let posts: BlogPost[] = Object.values(
        import.meta.glob("../pages/blog/*.md", { eager: true })
    );

    posts = posts.filter(post => !post.frontmatter.preview);

    return posts;
};

