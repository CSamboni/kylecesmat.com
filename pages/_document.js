import Document, { Head, Main, NextScript } from 'next/document'
import { renderStatic } from 'glamor/server'
import { style, rehydrate } from 'glamor';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import colors from '../style/colors';

// Adds server generated styles to glamor cache.
if (typeof window !== 'undefined') {
  rehydrate(window.__NEXT_DATA__.ids)
}

export default class MyDocument extends Document {
  static async getInitialProps ({ renderPage }) {
    const page = renderPage()
    const styles = renderStatic(() => page.html)
    return { ...page, ...styles }
  }

  constructor (props) {
    super(props)
    const { __NEXT_DATA__, ids } = props
    if (ids) {
      __NEXT_DATA__.ids = this.props.ids
    }
  }

  render () {
    return (
      <html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          <link rel="stylesheet" type="text/css" href="/static/app.css" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body
          {...style({
            padding: 0,
            margin: 0,
            overflowX: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            background: colors.offwhite,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            '*': {
              boxSizing: 'border-box'
            },
            ' > nav': {
              flex: 0,
            },
            '> nav + div': {
              flex: '1 1 100%',
            },
            ' > footer': {
              flex: 0,
            }
          })}
        >
          <Navigation />
          <Main />
          <Footer />
          <NextScript />
        </body>
      </html>
    )
  }
}
