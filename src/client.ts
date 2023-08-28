// import fetch from 'node-fetch';
const _importDynamic = new Function('modulePath', 'return import(modulePath)');
export const fetch = async function (...args: any) {
    const {default: fetch} = await _importDynamic('node-fetch');
    return fetch(...args);
}
// import { RequestInfo, RequestInit } from "node-fetch";
import * as fs from 'fs';
import FormData from 'form-data';

// const fetch = (url: RequestInfo, init?: RequestInit) =>  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

async function uploadFile(): Promise<void> {
  const form = new FormData();

  // Adding regular fields
  form.append('product', 'Product1');
  form.append('date', '2023-08-28');
  form.append('foobar', 'some text');


  // Adding file
  const fileStream = fs.createReadStream('./README.md');
  form.append('fileUpload', fileStream);

  // POST request
  try {
    const response = await fetch('http://localhost:3000/submit', {
      method: 'POST',
      body: form,
      headers: form.getHeaders() // Important to set the headers for multipart form data
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Response:', data);
    } else {
      console.log('Failed to upload, status:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadFile().catch(error => console.error('Caught error:', error));
