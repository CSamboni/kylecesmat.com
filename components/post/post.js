import PropTypes from "prop-types";
import { style } from "glamor";
import Page from "../page";
import { Heading } from "../typography";
import layout from "../../style/layout";
import { Panel } from "../panel";

const styles = {
  post: style({
    padding: `${layout.containerPadding}px`,
    maxWidth: layout.containerWidth,
    width: "100%",
    margin: `0 auto`
  }),
  date: style({
    fontWeght: 200,
    fontSize: 12,
    margin: "15px 0",
    display: "block"
  })
};

export const Post = ({ title, date, children }) =>
  <Page>
    <Panel>
      <Heading weight="1">
        {title}
      </Heading>
      <date className={styles.date}>
        Published {date}
      </date>
      <section>
        {children}
      </section>
    </Panel>
  </Page>;

Post.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
};

export default Post;
