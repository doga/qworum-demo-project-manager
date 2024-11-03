![Qworum logo and name](https://raw.githubusercontent.com/doga/qworum-website/master/build/assets/images/logos/Qworum-logo-and-name.svg "Qworum logo and name")

# Basic template for Qworum-based web applications

This is a template for a website that uses [Qworum](https://qworum.net)'s advanced web browser capabilities.

This template is:

- _Multi-language_, with language-independent API endpoint paths.
- _Versioned_. Indeed, Qworum applications are structured as Qworum APIs, and versioned APIs ensure that other applications that depend on this one will not break after an update.

This project has a [companion project](https://github.com/doga/qworum-application-template-with-semantic-data) that uses semantic data (RDF) instead of JSON.

## The "Hello World" Qworum application

This website implements a Qworum API that has 2 endpoints:

- the `home` endpoint, which is an application, and
- the `view-item` endpoint, called by `home`.

Here is the directory structure:

- Directories with 2-letter names such as `en` contain language-specific versions of the API endpoints.
- `assets` contains resources used by the web pages.
- All other directories (`home`, `view-item`) are the official endpoint paths; they are only used for redirecting API calls to language-specific endpoint versions.

## To do

Implement a login endpoint:

- [Launching a New Tab for OpenID Connect Login](https://g.co/gemini/share/e260edfb5045)
- [Common Login Protocols for Business Applications](https://g.co/gemini/share/2e761f775cd6)

## License

This software is released under the terms of the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

∎
