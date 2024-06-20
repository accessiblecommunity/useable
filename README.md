# **use**able

`useable`, provided by [Accessible Community](https://www.accessiblecommunity.org), associates people with disabilities' requirements for use with broader functional categories and known disabilities. This taxonomy crosses digital and physical spaces as well as accommodations in a way that previous categorizations have not. This type of mapping is needed to help build tools and resources to help the entire disability community.

The `useable` taxonomy is based around previous work in the fields of accessibility and accommodations:
* [Functional Performance Criteria](https://www.access-board.gov/ict/#302-functional-performance-criteria) provided by the United States Section 508 Standards for Digital Accessibility.
* [Functional Performance Statements](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.01.01_60/en_301549v030101p.pdf) provided by the European EN 301-549 Standards for Digital Accessibility.
* [The Listing of Impairments for adults](https://www.ssa.gov/disability/professionals/bluebook/AdultListings.htm) provided by the United States' Social Security Administration (SSA).
* [Guide to the List of Recognised Disabilities](https://www.dss.gov.au/our-responsibilities/disability-and-carers/benefits-payments/carer-allowance/guide-to-the-list-of-recognised-disabilities) provided by the Australian Government Department of Social Services.
* [The disability and accommodation taxonomy](https://askjan.org/a-to-z.cfm) provided by the Job Accommodation Network.
* [Framework for Accessible Specification of Technologies (FAST)](https://w3c.github.io/apa/fast/) provided by the World Wide Web Consortium (W3C).

We [welcome comments and feedback](https://github.com/accessiblecommunity/useable/issues) to encourage the establishment of a worldwide mapping to help build tools and solutions for people with disabilities. Please create or comment on any of the current GitHub issues.

## Repository layout

* The [`data`](https://github.com/accessiblecommunity/useable/tree/main/data) directory contains the original CSVs used to generate the taxonomy.
    * When cloning the repository, you make use your local [Node.js](https://nodejs.org/) install, or the supplied [Docker](https://www.docker.com/) container.
* The [`site`](https://github.com/accessiblecommunity/useable/tree/main/site) folder contains the javascript code used to build the site.
    * `useable` is powered by [Astro](https://astro.build/).
    * The `integration` folder is an Astro integration that converts the raw data into Astro content.

## Setting up a Development Environment

On almost every project, getting your development environment established is the first task and it can take a day or two to do so. This is a high-level overview so that you can be productive quickly.

* If you don't have one, we recommend installing an IDE that supports multiple languages (Python, Javascript, HTML/CSS, etc). The recommendations are [VS Code](https://code.visualstudio.com/) or [Sublime Text](https://www.sublimetext.com/), but really this is a developer choice.
* Install [Docker Desktop](https://www.docker.com/products/docker-desktop) or another way to run a containerized environment.
  * If on Windows, we recommend installing the [Linux Subsystem](https://learn.microsoft.com/en-us/windows/wsl/install) to help performance, but it’s not required. See [configuring Docker Desktop to use WSL 2](https://docs.docker.com/desktop/wsl/).
* Install a way to run `make`.
  * On Windows, use the Linux Subsystem or [chocolatey](https://chocolatey.org/).
  * On Mac, install the Xcode client tools or use [homebrew](https://brew.sh/).
  * If preferred, install some integration with the IDE you are using instead.
