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
>"If debugging is the process of removing software bugs then programming must be the process of putting them in." (link...)

The error trait

```

```

One of the most common approaches right now is to use an enum representing the different kinds of errors. This works well most of the time.

```rust
enum Error{
	FailedToParse,
	InvalidInput
}
```

We have to ask ourself how much information do we want to include in our error. But an enum isn't always the best way to produce errors. Say you were creating a compiler, there's some crucial information you would like to have with each error no matter what type of error it is. Such as the file and line.

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

If you're developing a library it's a good idea to actually impl `From` on third party errors rather that just wrapping the errors in your `Error` enum.

```rust
#[derive(Debug,Error)]
enum Error{
	#[error(transparent)]
	Reqwest(#[from] request::Error),
	#[error(transparent)]
	Serde(#[from] serde::Error)
}
```

If someone is using your library then they expect errors pertaining to the library not just wrappers around other errors. Some errors like io errors are understandable because they're always relevant.

Consider using `Error::source` when wrapping third party errors.

Non exhaustive?

## Localised errors
One thing I don't like about the current enum approach is that it makes it harder to match against errors ironically. Consider a function that downloads a file from a url endpoint and returns a generic error.

```rust
use thiserror::Error;

#[derive(Debug,Error)]
pub enum Error{
	#[error(transparent)]
	Io(#[from] io::Error),
	#[error(transparent)]
	Reqwest(#[from] reqwest::Error)
}

fn download_file(url: &str) -> Result<File,Error> {...}
```

If we actually wanted to match the errors we wouldn't know exactly what kind of errors could possibly be returned from this function. Instead we must accept that literally all possible errors may be returned, in which case we will just propagate the error upwards.

On the contrary a domain-specific error type would be more ideal as it would convey exactly what errors can be returned.

```rust
use thiserror::Error;

#[derive(Debug,Error)]
pub enum DownloadError{
	#[error("The url is not valid")]
	InvalidUrl,
	#[error("The file has exceeded the size limit")]
	FileTooBig,
	#[error("The server timed out")]
	Timeout,
}
```

However this adds some complexity, do we create an error for each function? Each file? Each module?