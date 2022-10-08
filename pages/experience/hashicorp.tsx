import * as React from "react";
import type { NextPage } from "next";
import type { Job } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { NextSeo } from "next-seo";
import { Box } from "components/Box";
import { Heading } from "components/Heading";
import { Link } from "components/Link";
import { List } from "components/List";
import { Prose } from "components/Prose";
import { Text } from "components/Text";
import { Spacer } from "components/Spacer";
import { HashiCorpHero } from "components/Hero";
import { allJobs } from "contentlayer/generated";

const formatTags = new Intl.ListFormat("en", { type: "conjunction" });

const HashiCorp: NextPage<{ job: Job }> = ({ job }) => {
  return (
    <>
      <NextSeo title={job.company} />

      <Box
        as="header"
        textAlign={{ md: "center" }}
        maxWidth="container"
        marginX="auto"
      >
        <HashiCorpHero />
        <Spacer height="xl" />
        <Heading fontSize={{ xs: "xxl", sm: "xxxl" }} as="h1">
          {job.company}
        </Heading>
        {job.description ? (
          <>
            <Spacer height="xl" />
            <Text
              fontSize={{ xs: "lg", sm: "xl" }}
              // color="foregroundNeutral"
              style={{
                display: "inline-flex",
              }}
            >
              {job.description}
            </Text>
          </>
        ) : null}
        {job.tags ? (
          <>
            <Spacer height="xl" />
            <Text
              fontSize="sm"
              color="foregroundNeutral"
              style={{
                display: "inline-flex",
              }}
            >
              {formatTags.format(job.tags)}
            </Text>
          </>
        ) : null}
      </Box>

      {job.currently ? (
        <>
          <Spacer height="xxxxl" />

          <Box as="section" maxWidth={{ md: "text" }} marginX={{ md: "auto" }}>
            <Prose>
              <Heading fontSize="xl">Currently</Heading>
              <Text color="foregroundNeutral">{job.currently}</Text>
            </Prose>
          </Box>
        </>
      ) : null}

      <Spacer height="xxxxl" />

      <Box as="section" maxWidth={{ md: "text" }} marginX={{ md: "auto" }}>
        <Heading fontSize="xl">Projects</Heading>

        <Spacer height="xxl" />

        <List>
          {job.projects?.map((project, index) => {
            return (
              <List.Item key={index}>
                <Box
                  as="article"
                  display="flex"
                  flexDirection={{
                    xs: "column",
                    sm: "row-reverse",
                  }}
                  alignItems={{ sm: "center" }}
                  justifyContent={{ sm: "space-between" }}
                  gap="sm"
                  maxWidth="text"
                >
                  <Text
                    color="foregroundNeutral"
                    fontSize="sm"
                    as="time"
                    dateTime={project.date}
                  >
                    {format(parseISO(project.date), "MM/dd/Y")}
                  </Text>
                  <Heading as="h3">
                    <Link href={project.link}>{project.title}</Link>
                  </Heading>
                </Box>
                {project.description ? (
                  <>
                    <Spacer height={{ xs: "sm", sm: "md" }} />
                    <Text color="foregroundNeutral">{project.description}</Text>
                  </>
                ) : null}
              </List.Item>
            );
          })}
        </List>
      </Box>
    </>
  );
};

export default HashiCorp;

export async function getStaticProps() {
  const job = allJobs.find((job) => job.company === "HashiCorp");
  return {
    props: {
      job,
    },
  };
}