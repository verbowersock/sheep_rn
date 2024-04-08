import { dateDisplayFormatter } from "../utils/SharedFunctions";

export function htmlContent(htmldata) {
  const medRows = htmldata.formattedSheepMeds.map((med) => {
    return `
      <tr>
        <td class="med_name">${med.entry}</td>
        <td class="med_dosage">${med.dosage}</td>
        <td class="date">${med.date}</td>
      </tr>
    `;
  });
  const vaxRows = htmldata.formattedSheepVax.map((vax) => {
    return `
      <tr>
        <td>${vax.entry}</td>
        <td class="date">${vax.date}</td>
      </tr>
    `;
  });

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice</title>
    <link
      rel="license"
      href="https://www.opensource.org/licenses/mit-license/"
    />
    <style>
     
    body {
      width: 8.5in; /* Equivalent to 612 pixels at 72dpi */
      height: 11in; /* Equivalent to 792 pixels at 72dpi */
      margin: 1in; /* Equivalent to 72 pixels at 72dpi */
      padding: 0.5in; /* Add padding to simulate margins */
      box-sizing: border-box; /* Include padding in the total width/height */
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      font-style: inherit;
      font-weight: inherit;
      line-height: inherit;
      list-style: none;
      margin: 0;
      text-decoration: none;
      vertical-align: top;
      font: 16px/1 "Open Sans", sans-serif;
    }

    h1 {
      font: bold 100% sans-serif;
      text-align: center;
      text-transform: uppercase;
      font-size: x-large;
      padding-bottom: 0.5rem
    }
    
    h2 {
      font: bold 100% sans-serif;
      text-align: left;
      text-transform: uppercase;
      font-size: larger;
      padding-bottom: 0.5rem;
      padding-top: 0.5rem;
    }

    h3 {
      font: bold 100% sans-serif;
      text-align: left;
      font-size: large;
      padding-bottom: 0.5rem;
      padding-top: 0.5rem;
    }

    /* table */

    table {
      font-size: 50%;
      table-layout: auto;
      width: 100%;
      border-collapse: separate;
      border-spacing: 2px;
    }

    .medical tbody tr:nth-child(even) {
      background: #eee;
    }
    .medical tbody tr:nth-child(odd) {
      background: #fff;
    }
    
    th,
    td {
      position: relative;
      text-align: left;
      font-size: medium;
      padding-left: 6px
      height: auto;
      word-wrap: break-word;
      max-width: 45%;
    }
    th {
      background: #eee;
      width: 35%;
    }
    .med_name {
      min-width: 40%;
      padding-right: 6px;
      padding-left: 6px;
    }
    .med_dosage {
      max-width: 20%;
      padding-right: 6px;
      padding-left: 6px;
    }
    .date {
      text-align: right;
      padding-right: 6px;
      padding-left: 6px;
    }
    /* page */

   .left {
      float: left;
      width: 48%;

    }
    .right {
      float: right;
      width: 48%;
    }
    /* header */

    header {
      margin: 0;
      width: 100%;
    }
   

  </style>
    </head>
    <body>
      <header>
        <h1>${htmldata.name ? htmldata.name : htmldata.tag_id}</h1>
      </header>
  <section class="left">
      <h2>Basic information</h1>
          <table class="meta">
        <tr>
          <th><span>Date of Birth</span></th>
          <td><span>${htmldata.dob}</span></td>
        </tr>
        <tr>
          <th><span>Tag ID</span></th>
          <td><span>${htmldata.tag_id}</span></td>
        </tr>
        <tr>
          <th><span>Scrapie ID</span></th>
          <td><span>${
            htmldata.scrapie_id ? htmldata.scrapie_id : "NA"
          }</span></td>
        </tr>
        <tr>
          <th><span>Sex</span></th>
          <td><span>${htmldata.sex}</span></td>
        </tr>
        <tr>
          <th><span>Breed</span></th>
          <td><span>${htmldata.breed_name}</span></td>
        </tr>
        <tr>
          <th><span>Color</span></th>
          <td><span>${htmldata.color_name}</span></td>
        </tr>
        <tr>
          <th><span>Marking</span></th>
          <td><span>${htmldata.marking_name}</span></td>
        </tr>
        <tr>
          <th><span>Date of Purchase</span></th>
          <td><span>${htmldata.dop ? htmldata.dop : "NA"}</span></td>
        </tr>
        <tr>
          <th><span>Date of Sale</span></th>
          <td><span>${htmldata.dos ? htmldata.dos : "NA"}</span></td>
        </tr>
        <tr>
          <th><span>Date of Death</span></th>
          <td><span>${htmldata.dod ? htmldata.dod : "NA"}</span></td>
        </tr>
        <tr>
          <th><span>Weight at birth</span></th>
          <td><span>${htmldata.formattedWeightAtBirth}</span></td>
        </tr>
        <tr>
          <th><span>Last weight recorded</span></th>
          <td><span>${
            htmldata.formattedLastWeight.entry
              ? htmldata.formattedLastWeight.entry +
                " - " +
                htmldata.formattedLastWeight.date
              : "NA"
          }</span></td>
        </tr>
  
      </table>
      <h2>Breeding information</h1>
          <table class="meta">
        <tr>
          <th><span>Sire</span></th>
          <td><span>${
            htmldata.father_name
              ? htmldata.father_name
              : htmldata.father_tag_id
              ? htmldata.father_tag_id
              : "NA"
          }</span></td>
        </tr>
        <tr>
          <th><span>Dam</span></th>
          <td><span>${
            htmldata.mother_name
              ? htmldata.mother_name
              : htmldata.mother_tag_id
              ? htmldata.mother_tag_id
              : "NA"
          }</span></td>
        </tr>
        <tr>
          <th><span>Date Last Bred</span></th>
          <td><span>${
            htmldata.date_last_bred ? htmldata.date_last_bred : "NA"
          }</span></td>
        </tr>
      </table>
    </section>
    <section class = "right">
      <h2>Medical information</h1>

          <h3>Medication history</h3>
          <table class="medical">
         ${
           htmldata.formattedSheepMeds.length > 0
             ? "<td>" + medRows.join("") + "</td>"
             : "<td><span>NA</span></td>"
         }
        </table>


          <h3>Vaccination history</h3>
          <table class="medical">
          ${
            htmldata.formattedSheepVax.length > 0
              ? "<td>" + vaxRows.join("") + "</td>"
              : "<td><span>NA</span></td>"
          }

     </table>
    </section>
    </body>
  </html>
`;
}
