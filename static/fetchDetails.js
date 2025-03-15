/**
 *
 * @source: https://codeberg.org/sdk/getBankDetailsFromIFSC/raw/branch/pages/static/js/fetchDetails.js
 *
 * @licstart  The following is the entire license notice for the
 * JavaScript and Pyothn code in this page.
 *
 * Copyright (C) 2025  @theReadOnly / @sdk
 *
 * The JavaScript and Python code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * Affero General Public License (GNU AGPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.
 *
 * For full license: https://codeberg.org/sdk/getBankDetailsFromIFSC/src/branch/main/LICENSE
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 * If you want to liberate your js:
 * Refer how to free your js - https://www.gnu.org/software/librejs/free-your-javascript.html
 */

"use strict";

async function main() {
  let pyodide = await loadPyodide();
  //pyodide.setDebug(true);
  await pyodide.loadPackage("texttable");

  let pythonCode = `

        import asyncio
        import js,json
        from pyodide.http import pyfetch
        from texttable import Texttable

        async def fetch_data(user_ifsc):
            url = f'https://ifsc.razorpay.com/{user_ifsc}'
            response = await pyfetch(url)
            json_data = await response.json()
            js.console.log(json_data)

            table = Texttable()
            table.add_row(["Data", "Description"])  # Add header
            for key, value in json_data.items():
                table.add_row([key, value])  # Add rows
            # Display JSON data on the web page
            document = js.document
        #    pre = document.createElement('code')
        #    pre.textContent = json.dumps(json_data, indent=4)
        #    document.body.appendChild(pre)
            pre = document.getElementById('jsonResult')
            if pre is None:
                pre = document.createElement('pre')
                pre.id = 'jsonResult'
        #        center = document.getElementById('centerTag')
        #        center.appendChild(pre)
                document.querySelector('center').appendChild(pre)
            pre.textContent = json.dumps(json_data, sort_keys=True,indent=4).replace('{','').replace('}','')
        #    pre.textContent = table.draw()


        # Run the fetch_data coroutine
        # after we Get user input ifsc from JavaScript and to call fetch_data
        def call_fetch_data(*args, **kwargs):
            user_ifsc = js.document.getElementById('userInput').value
            asyncio.ensure_future(fetch_data(user_ifsc))

        #from js import document
        #document.getElementById('fetchButton').addEventListener('click', call_fetch_data)

        from js import document
        from pyodide.ffi import create_proxy

        # Create a proxy for the Python function
        call_fetch_data_proxy = create_proxy(call_fetch_data)
        document.getElementById('fetchButton').addEventListener('click', call_fetch_data_proxy)
        `;
  pyodide.runPythonAsync(pythonCode);
}

main();
