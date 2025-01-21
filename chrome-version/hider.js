let climb_known = false

//Find any attempt/send, disable grade hiding for the rest of the page
function ticked() {
    const ascentPattern = /\/ascents\/at\/\d+\/by\/\d+/;
    const links = document.querySelectorAll('a');

    for (const link of links) {
        if (link.href && ascentPattern.test(link.href)) {
            climb_known = true
            return;
        }
    }
} ticked()

//Disable grade hiding for climber page
function climber_page() {
  const pattern = /^(?:https?:\/\/)?(?:www\.)?thecrag\.com\/climber\//i;
  const currentUrl = window.location.href;
  climb_known = pattern.test(currentUrl);
} climber_page()


//New/unknown climb
if (!climb_known) {
    
    document.addEventListener('DOMContentLoaded', function() {
        const dom_selectors = {
          gba: 'span[class*=" gb"]',
          gbb: 'span[class*="gb"]',
          gbc: 'span[class^="gb"]'
        };
      
        function tick_label(selector) { 
          const elements = document.querySelectorAll(dom_selectors[selector]);
          elements.forEach(element => {
            element.textContent = 'Vx';
          });
        }
      
        for (const selector in dom_selectors) { 
          tick_label(selector); 
        }
      });

    const selectors = {
        //element.textContent = 'Vx'
        gba: 'span[class*=" gb"]',
        gbb: 'span[class*="gb"]',
        gbc: 'span[class^="gb"]',
        gbd : 'span[class*="grade gb"]',

        //link.textContent = "Difficulty - Vx" 
        diff_scale: 'a.heading__t[href="#grades"]', 

        //link.textContent = `Difficulty`
        sidebar_diff: '.heading__t[href^="#difficulty-"]',

    }

    function edit_text(selector) {
        const elements = document.querySelectorAll(selectors[selector]);
        elements.forEach(element => {
            if (selector == 'gba' || selector == 'gbb' || selector == 'gbc' || selector == 'gbd') {
                element.textContent = 'Vx'
            }
            if (selector == 'diff_scale') {
                element.textContent = "Difficulty - Vx" 
            }
            if (selector == 'sidebar_diff') {
                element.textContent = 'Difficulty'
            }
        })
    } Object.keys(selectors).forEach(selector => edit_text(selector));

function no_hover() {
    document.addEventListener('mouseover', function(e) {
        e.stopPropagation();
        e.preventDefault();
    }, true);
} no_hover()

//On climb page only //

function suggested_grade() {
    document.querySelectorAll('tr').forEach(row => {
        if (row.title && row.title.includes('ascent')) {
            row.style.display = 'none';
        }
    });
} suggested_grade()

function tab_title() {
    const originalTitle = document.title;
    const words = originalTitle.split(' '); 
    const newTitle = words.slice(1).join(' '); 
    document.title = newTitle;
} tab_title()

function grades_table() {
    document.querySelectorAll('.compacttable').forEach(table => {
        if (Array.from(table.getElementsByTagName('td')).some(td => 
            td.textContent.trim() === 'Assigned grade'
        )) {
            table.style.display = 'none';
        }
    });
} grades_table()

function observeDOMChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          Array.from(mutation.addedNodes).forEach(node => { 
            if (node.nodeType === Node.ELEMENT_NODE) { 
              const newElements = node.querySelectorAll('span[class*=" gb"]'); 
              newElements.forEach(element => {
                element.textContent = 'Vx'; 
              });
            }
          });
        }
      });
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  } observeDOMChanges();
  
}
