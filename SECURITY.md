# Security Policy

## Supported Versions

This project is a static web app. Security fixes are made on the default branch.

## Reporting a Vulnerability

Please do not open a public issue for a security vulnerability.

Report security concerns privately through the contact options on the maintainer's GitHub profile. Include:

- A description of the issue
- Steps to reproduce it
- The affected browser or environment
- Any suggested fix, if known

The maintainer will review the report and coordinate a fix when appropriate.

## Notes

Unpuzzled resolves image URLs provided by the user and displays the fetched image in the browser. It should not execute decoded content, inject decoded values as HTML, or send decoded values anywhere except the Jigsaw Explorer fetch endpoint used to display the image.
