---
title: In search of the perfect error
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: If debugging is the process of removing software bugs then programming must be the process of putting them in
image: /thumbnails/rust-nightly-features.png
imageSize: 12
published: 2025-12-12
guid:
---
>If debugging is the process of removing software bugs then programming must be the process of putting them in (link...)

One of the most common approaches right now is to use an enum representing the different kinds of errors. This works well most of the time.

```rust
enum Error{
	FailedToParse,
	InvalidInput
}
```

We have to ask ourself how much information do we want to include in our error. 

```rust
struct Error{
	file: PathBuf,
	line: u32,
	col: u32,
	kind: ErrorKind
}

enum ErrorKind{
	SyntaxError
}
```

If we're never going to match against the error then using, 

If you're developing a library it's a good idea to actually impl `From` on third party errors rather that just wrapping the errors in your `Error` enum

```rust
#[derive(Debug,Error)]
enum Error{
	#[error(transparent)]
	Reqwest(#[from] request::Error),
	#[error(transparent)]
	Serde(#[from] serde::Error)
}
```
