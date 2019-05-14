import React from 'react';

export default function Help() {
  return (
    <div className="Help">
      <h2>Template Formatting Help</h2>
      <p>The template uses <a href="https://www.markdownguide.org/cheat-sheet/">Mark Down</a>.</p>
      <ul>
        <li><b># Heading1</b> For Top Level heading</li>
        <li><b>## Heading 2</b> Second level heading</li>
        <li><b>### Heding 3</b>Third level heading</li>
        <li><b>**Bold**</b></li>
        <li><b>*Italic*</b></li>
        <li><b>***Bold Italic***</b></li>
        <li><b>---</b> For a horizontal line</li>
        <li><b>&nbsp;</b> Followed by 2 spaces for forced blank line separation</li>
      </ul>
      <p>
        You could use data entered via form by placing them
        within double curly brackets like <b>{'{{NAME}}'}</b>.
        Use the name of the field (case-sensitive) like <b>PN</b>, <b>DATE</b> or
        any other custom ones that you have created.
      </p>
      <h3>Special Placeholders</h3>
      <p>
        Apart from fields, there are various other special placeholders
        that you could use.
        <ul>
          <li>
            <b>His, He, Him</b>
            : These placeholder works with GENDER field.<br/>
            Example: <b>{'{{He}}'} is in sound health</b>
          </li>
          <li>
            <b>Mr</b>
            : This place holder works with GENDER and MARRIED field.
          </li>
          <li><b>YYYY</b>: Display 4 digit year 2018, 2019</li>
          <li><b>YY</b>: Display 2 digit year 18, 19</li>
          <li><b>Do</b>: Display date of month with suffix 1st, 2nd, ...</li>
          <li><b>DD</b>: Display 2 digit date of month 01, 02, ...</li>
          <li><b>ddd</b>: Display 3 character week day Sun, Mon, ...</li>
          <li><b>dddd</b>: Display full week day Sunday, Monday, ...</li>
          <li><b>MM</b>: Display 2 digit month 01, 02, ... 11, 12</li>
          <li><b>MMM</b>: Dislay 3 character month Jan, Feb, ...</li>
          <li>Example: <b>{'{{Do}} {{MMM}}, {{YYYY}}'}</b> becomes <b>1st Jan, 2019</b></li>
          <li>
            <b>AGE</b>
            : This is a special place holder that uses DOB and DATE field to calculate age.
            Example: <b>{'{{AGE}}'} old</b> becomes <b>99 years old</b>
          </li>
        </ul>
        <h3>Using list values</h3>
        <p>Enter list data in multiple lines and use specical prefixes to display them in bullets or numbering</p>
        <ul>
          <li><b>{'{{MEDICATIONS:*}}'}</b> will display medications as bulleted list</li>
          <li><b>{'{{MEDICATIONS:1.}}'}</b> will display medications as numbered list</li>
        </ul>
        <h3>Formatting numbers</h3>
        <p>You could format number values</p>
        <ul>
          <li><b>{'{{PRICE:#:0.00}}'}</b> will display number with 2 decimal places.</li>
          <li>Example: <b>{'{{PRICE:#:0,0}}'}</b> will display number with comma separation</li>
        </ul>
      </p>
    </div>
  )
}