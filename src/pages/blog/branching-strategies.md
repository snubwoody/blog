---
preview: false
title: Branching strategies
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/hosting-rust.png
imageSize: 0
published: 2025-08-07
tags:
  - Git
---
So I was recently looking at the changelog for [`Penpot`](https://penpot.app/), and I noticed that they had changes that were meant for 2.9 and other for 2.10. I know that this is a thing, but I started wondering how exactly do they do it? Do they have branches for each release? What changes go into main? So I'll be going over different branching strategies.

Branching strategies could also be called release management, or at least that's how I like to think about it. Because it's all about how we manage changes to software. If your branching strategy needs a complex diagram for people to understand it, then it maybe it might be doing too much.

## Trunk based development
[Trunk based development](https://trunkbaseddevelopment.com/) is strategy in which all developers work on a single branch, this is usually `main`, `master` or `trunk`, while features/changes are developed on feature branches.

When the feature is done the feature branch is merged back into the main branch. This means the main branch is the single source of truth. With a good CI workflow then the main branch is always tested and buildable. Ideally only one developer should be working on each branch. 

Think of branches as extended commits, you might want to improve an error message in an API, for example. This is one fairly simple change, but it won't just be one commit, you might change the message, then improve the errors to handle more cases, add some more tests, format and lint, update internal documentation or changelogs. From one change you may have about 5 to 6 commits, which is the importance of the feature branch: to let you make changes without affecting the main branch until you're ready to merge.  

## Github flow
[Github flow](https://docs.github.com/en/get-started/using-github/github-flow) is very similar to trunk based development, but with a strong emphasis on pull requests.

For every change you create a branch with a short descriptive name, this branch allows you to make changes without affecting the main branch. You should make a separate branch for each set of unrelated changes, for example you might be working on a new feature but encounter a bug that isn't related at all to the feature, it would be wise to stash/commit your changes, create a seperate branch to fix, merge back into main and merge main into your feature branch.

Create a pull request when you are ready to be merge these changes into main, pull requests are a hub for collaboration, testing and reviewing. If everything goes well you merge your pull request into main.

This difference between this and trunk based development, is that TBD specifies no need for pull requests or reviews, simply that features are developed in their own branches and merged back into main.
## Git flow
[Git flow](https://nvie.com/posts/a-successful-git-branching-model/) a branching model that involves the use of feature branches and multiple primary branches. This workflow uses two main branches `main` and `develop`. The idea here is that the main branch should contain production ready code, as opposed to trunk based development where the main branch may have many changes that are not ready for release yet.

In addition to `main` and `develop`, supporting branches such as `feature`, `release` and `hotfix` are also used to make changes and are merged back into the develop branch. Even though there's a lot of branches, if you always fast forward merge then it leads to a less convoluted history.
The "multiple primary branches" part is what makes this so complex to use, it's hard keeping many branches in sync with each other. 

The idea here is that `main=production` the state of main is generally the state of production. So you may even set up your CI to automatically release anything that get's merged into main.

## Environment branching
Environmental branching is used to represent different deployment environments in your infrastructure, for example `dev`, `qa`, `staging` and `prod`.

This sounds reasonable, but this could have very well been configured using environment variables. Also what happens if someone makes a change directly to `qa` does it get backported to `staging`? What if you made a typo in the release notes and decide to just fix it in `staging` before pushing to production, does it get merged into the other branches before it?

## Release branching
This isn't necessarily it's own strategy, but it's based on the idea that releases get their own long lived branches. So one case is that each release gets it own branch, where any upkeep and changes are done before releasing the new version. 

```bash
git checkout -b release/v2.2.0
```

If everything is done on the main branch then you may have changes getting merged that you didn't want to be in this version, like new feature meant for the next version. So this kind of freezes the codebase, allowing you to update documentation, write release notes and so on, while the main branch is still the hub for everything else. After everything is done and the version is release, it can be merged back into main.

Another scenario is keeping history of previous version, for example long term support versions need to have bug fixes and minor patches backported, so the branch would be something like `lts/v26.5`. Then appropriate changes would be [cherry picked](https://git-scm.com/docs/git-cherry-pick) onto the lts branch. 
## Reality
Some teams strictly follow one branching strategy, but the reality is that many teams will use custom strategies, that may borrow concepts from others, to manage their software. For example the rust team uses a [custom strategy](https://doc.rust-lang.org/book/appendix-07-nightly-rust.html) with three channels: stable, beta and nightly, which use the three branches, `main`, `stable` and `beta`. Changes are made on the `master` branch which get's released every night (nightly), every six weeks a beta release which goes on the `beta` branch, six weeks after that `beta` is merged into `stable` which is what most people use.

The more branches exist the harder it is to maintain them.