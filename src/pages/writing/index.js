import React from 'react';
import styled from 'styled-components';
import Page from '../../components/page';
import Link from '../../components/link';
import { Panel } from '../../components/panel';
import { media } from '../../styles/media-queries';
import typography from '../../styles/typography';

const Heading = styled.h1`
  text-align: center;

  ${media.desktop`
    text-align: left;
  `};
`;

const Post = styled.li`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: left;
  font-size: 18px;
  margin-bottom: 25px;

  ${media.desktop`
    flex-direction: row;
    margin-bottom: 15px;
  `};
`;

const PubDate = styled.span`
  font-family: ${typography.mono};
  font-size: 12px;

  ${media.desktop`
    flex-basis: 140px;
  `};
`;

export default ({
  data: {
    allMarkdownRemark: { edges }
  }
}) => (
  <Page title="Writing">
    <Panel>
      <Heading>Writing</Heading>
      <ul>
        {edges.map(({ node: { frontmatter, fields } }) => (
          <Post key={frontmatter.title}>
            <PubDate>{frontmatter.date}</PubDate>
            <Link styled to={fields.slug}>
              {frontmatter.title}
            </Link>
          </Post>
        ))}
      </ul>
    </Panel>
  </Page>
);

export const pageQuery = graphql`
  query AllBlogPosts {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
