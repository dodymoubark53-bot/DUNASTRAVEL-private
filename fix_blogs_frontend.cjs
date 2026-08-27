const fs = require('fs');

// 1. Fix BlogDetails.jsx
const blogDetailsPath = 'd:/@@project/LUXURY-PROJECT/frontend/src/pages/blogs/BlogDetails.jsx';
let blogDetails = fs.readFileSync(blogDetailsPath, 'utf8');

blogDetails = blogDetails.replace(
  /src=\{blog\.img\}/g,
  'src={blog.img || blog.coverImage || "/imgs/hero.png"}'
);

blogDetails = blogDetails.replace(
  /src=\{relBlog\.img\}/g,
  'src={relBlog.img || relBlog.coverImage || "/imgs/hero.png"}'
);

blogDetails = blogDetails.replace(
  /\{t\(`blogs\.\$\{blog\.date\}`, blog\.date\)\}/g,
  "{blog.date || (blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Recent')}"
);

const oldContentMap = /\{blog\.content\.map\(\(paragraph, idx\) => \{[\s\S]*?\}\)\}/;

const newContentRender = `{typeof blog.content === 'string' ? (
            <div
              className="leading-relaxed text-body-lg text-obsidian-700 space-y-6"
              dangerouslySetInnerHTML={{ __html: renderContent(blog.content) }}
            />
          ) : Array.isArray(blog.content) ? (
            blog.content.map((paragraph, idx) => {
              const translated = t(\`blogs.\${paragraph}\`, paragraph);
              if (translated.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold font-display text-obsidian-900 mt-10 mb-4">
                    {translated.replace('### ', '')}
                  </h3>
                );
              }
              if (translated.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-2xl md:text-3xl font-bold font-display text-obsidian-900 mt-12 mb-6 border-b border-gold-500/20 pb-3">
                    {translated.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={idx} className="mb-6 leading-relaxed text-body-lg text-obsidian-700" dangerouslySetInnerHTML={{ __html: renderContent(translated) }} />
              );
            })
          ) : null}`;

blogDetails = blogDetails.replace(oldContentMap, newContentRender);
fs.writeFileSync(blogDetailsPath, blogDetails);
console.log('Fixed BlogDetails.jsx');

// 2. Fix Blogs.jsx
const blogsPath = 'd:/@@project/LUXURY-PROJECT/frontend/src/pages/Blogs.jsx';
let blogs = fs.readFileSync(blogsPath, 'utf8');

blogs = blogs.replace(
  /src=\{blog\.img\}/g,
  'src={blog.img || blog.coverImage || "/imgs/hero.png"}'
);

blogs = blogs.replace(
  /\{t\(`blogs\.\$\{blog\.date\}`, blog\.date\)\}/g,
  "{blog.date || (blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Recent')}"
);

fs.writeFileSync(blogsPath, blogs);
console.log('Fixed Blogs.jsx');
