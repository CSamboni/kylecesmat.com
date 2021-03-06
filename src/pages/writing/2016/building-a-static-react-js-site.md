---
path: "/writing/2016/building-react-static-site"
date: "2017-12-16"
title: "Building a static site with ReactJS"
---

Over the years I've used many platforms to build pages & sites for the web, which basically
equates to saying I've generated HTML and CSS a bunch of different ways so that people on the
internet can see the things.

One of the biggest challenges in building webpages is making sure that the experience feels
cohesive, the content is maintainable, and most importantly that the person accessing these
pages can do so quickly & with enjoyment!. That doesn't sound too hard, right? Let's look at
some of the popular approaches to building a personal website:

1.  _Wordpress_ - Authors add/edit content, add functionality, and manage the web
    experience right from a dashboard. This approach is awesome for authors, and it lets them
    make robust sites quickly. But wordpress can be really tough to do right - Readers are often
    stuck downloading a magnitude more code to see a site, and the technical infrastructure to
    run a Wordpress site can be intimidating & hard to maintain.

2.  _Plain HTML/CSS_ - There's nothing more artisanal than hand-coding a webpage, and
    ensuring that what is written is what actually gets sent to the user. This approach is
    straightforward, requires less technical investment, and most of the time - _It Just Works_.
    But, maintaining a set of HTML/CSS files can get tough as your site grows, and adding
    functionality isn't as easy as turning on a plugin.

3.  _Jekyll/Hugo/Gatsby Generator_ - Static-site generators are the best of both worlds,
    providing support for shared code, permalink generation, general code-bundling, and for
    developers who are used to tools like `npm` & `gulp` it provides an extensible environment
    to add functionality & control the output. There is nothing more magic than typing `npm build` and having a site ready to deploy. The only issue I've had with tools like these is
    having to opt-into their set of opinions, and sometimes hacking around the tool to receive
    the output I want.

Many amazing websites (far better than this one) are built using these approaches, but I
wanted a way to use the modularity of ReactJS and receive static output, without all the
opinions that many static-site generators enforce, so let's talk about the workflow I built.

### Content Management

We need a way to generate pages for each post, containing metadata, images, rich content, etc.

This is what a post looks like, located at `/posts/post-name.md`:

```
---
title: A Cool Title
date: '2016-12-29T23:58:59+00:00'
description:
---
Content can go here...
```

Using a node script, we will first _loop over all posts & put them in a posts object_,
then use `front-matter` to parse metadata, and finally inject these posts into the webpack build\* so we can access them within the
app.

This is what building our posts looks like:

```js
const readPosts = (docsDir) => {
  const promiseArray = [];
  const docsPages = [];

  return new Promise((fulfill) => {
    fs
      .walk(docsDir)
      .on('data', (item) => {
        if (!item.stats.isFile()) {
          return;
        }

        const route = buildRoute(path.basename(item.path, '.md'));

        promiseArray.push(
          getMarkdown(item.path, 'utf8').then((parsedMarkdown) => {
            docsPages.push({
              route,
              title: parsedMarkdown.attributes.title,
              date: parsedMarkdown.attributes.date,
              description: parsedMarkdown.attributes.description,
              markdown: parsedMarkdown.body
            });
          })
        );
      })
      .on('end', () => {
        Promise.all(promiseArray).then(() => {
          fulfill(docsPages);
        });
      });
  });
};
```

Now that we have our post information, we'll pass this to the webpack process via an
environment variable, like so:

```js
env.POSTS = JSON.stringify(posts);
env.STATIC_ROUTES = JSON.stringify(getRoutes(posts));

// run build script
const child = spawn('npm', ['run', command], {
  cwd: path.resolve(__dirname),
  env
});
```

We inject two variables, once being the posts and the other being the posts' routes. The
routes need to be defined so that `webpack-static-site-generator` knows which application
routes exist.

Now that we have posts flowing into our webpack build, we can use webpack's `DefinePlugin` to
create a global `POSTS` variable that we can use to generate posts within the React App.

```js
new webpack.DefinePlugin({
'process.env.NODE_ENV': '"production"',
'POSTS': process.env.POSTS,
}),
new StaticSiteGeneratorPlugin('bundle', JSON.parse(process.env.STATIC_ROUTES)),`;
```

We've now created a small build process to read posts, generate routes, and provide them to
the React App for use. We can extend upon this by adding perhaps an `assets` folder that
pushes to AWS, additional markdown parsers, a function to generate reading length, etc.

There is something really powerful about a build process you understand, and can maintain.
Creating a personal site that is both a learning ground & a platform that is predictable is
important to harbor consistent writing, and encourage you to "keep your site updated".
