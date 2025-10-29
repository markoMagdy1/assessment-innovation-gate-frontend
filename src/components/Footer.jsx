import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white shadow-sm mt-5 py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p className="mb-2 mb-md-0 text-muted">
          &copy; {new Date().getFullYear()} Marko Magdy. All rights reserved.
        </p>
        <div>
          <a
            href="#"
            className="text-muted me-3 text-decoration-none"
            target="_blank"
            rel="noreferrer"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-muted text-decoration-none"
            target="_blank"
            rel="noreferrer"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
