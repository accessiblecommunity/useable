## **use**able

`useable`, provided by [Accessible Community](https://www.accessiblecommunity.org), associates people with disabilities' requirements for use with broader functional categories and known disabilities. This taxonomy crosses digital and physical spaces as well as accommodations in a way that previous categorizations have not. This type of mapping is needed to help build tools and resources to help the entire disability community.

The `useable` taxonomy is based around previous work in the fields of accessibility and accommodations:
* [Functional Performance Criteria](https://www.access-board.gov/ict/#302-functional-performance-criteria) provided by the United States Section 508 Standards for Digital Accessibility.
* [Functional Performance Statements](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.01.01_60/en_301549v030101p.pdf) provided by the European EN 301-549 Standards for Digital Accessibility.
* [The Listing of Impairments for adults](https://www.ssa.gov/disability/professionals/bluebook/AdultListings.htm) provided by the United States' Social Security Administration (SSA).
* [Guide to the List of Recognised Disabilities](https://www.dss.gov.au/our-responsibilities/disability-and-carers/benefits-payments/carer-allowance/guide-to-the-list-of-recognised-disabilities) provided by the Australian Government Department of Social Services.
* [The disability and accommodation taxonomy](https://askjan.org/a-to-z.cfm) provided by the Job Accommodation Network.
* [Framework for Accessible Specification of Technologies (FAST)](https://w3c.github.io/apa/fast/) provided by the World Wide Web Consortium (W3C).

We [welcome comments and feedback](https://github.com/accessiblecommunity/useable/issues) to encourage the establishment of a worldwide mapping to help build tools and solutions for people with disabilities. Please create or comment on any of the current GitHub issues.

### Repository layout

* The [`data`](https://github.com/accessiblecommunity/useable/tree/main/data) directory contains the original CSVs used to generate the taxonomy.
    * When cloning the repository, you make use your local [Node.js](https://nodejs.org/) install, or the supplied [Docker](https://www.docker.com/) container.
* The [`site`](https://github.com/accessiblecommunity/useable/tree/main/site) folder contains the javascript code used to build the site.
    * `useable` is powered by [Astro](https://astro.build/).