const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: "index.html",
    maxAge: '1d',
    redirect: false,
    setHeaders (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }

  module.exports = options;