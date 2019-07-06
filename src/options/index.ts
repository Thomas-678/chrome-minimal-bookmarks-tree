/* global window,document */

import {
  nothing,
  setBrowserActionIcon,
  translateDocument,
} from '../common/functions';
import {SettingsFactory} from "../common/settings";

(function init(settings, chrome) {
  const addEventListenerMulti = (element, events, callback) => {
    events.split(' ').forEach(event => element.addEventListener(event, callback, false));
  };

  const initDropDowns = () => {
    const dropdowns = window.document.querySelectorAll('select');
    dropdowns.forEach((dropdown: HTMLSelectElement) => {
      const id = dropdown.getAttribute('id');
      dropdown.value = String(settings.get(id));
      if (id === 'font') {
        dropdown.style.fontFamily = `"${dropdown.value}"`;
      }
      addEventListenerMulti(dropdown, 'change click keyup', () => {
        settings.set(id, dropdown.value);
        if (id === 'icon') {
          setBrowserActionIcon(dropdown.value);
        }
        if (id === 'font') {
          dropdown.style.fontFamily = `"${dropdown.value}"`;
        }
      });
    });
  };

  const fontList = window.document.querySelector('#font');
  chrome.fontSettings.getFontList((fonts) => {
    fonts.forEach((font) => {
      const option = window.document.createElement('option');
      option.textContent = font.displayName;
      option.style.fontFamily = `"${font.displayName}"`;
      option.textContent = font.displayName;
      fontList.appendChild(option);
    });
    fontList.parentElement.classList.remove('hidden');
    initDropDowns();
  });

  const checkboxes = window.document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox: HTMLInputElement) => {
    const id = checkbox.getAttribute('id');
    if (settings.get(id)) {
      checkbox.setAttribute('checked', 'checked');
    }
    addEventListenerMulti(checkbox, 'click keyup', () => {
      settings.set(id, checkbox.checked);
    });
  });

  const numericInputs = window.document.querySelectorAll('input[type="number"]');
  numericInputs.forEach((numericInput: HTMLInputElement) => {
    const id = numericInput.getAttribute('id');
    numericInput.value = String(settings.get(id));
    addEventListenerMulti(numericInput, 'change keyup', () => {
      const value = parseInt(numericInput.value, 10);
      const minValue = parseInt(numericInput.getAttribute('min'), 10);
      const maxValue = parseInt(numericInput.getAttribute('max'), 10);
      if (Number.isNaN(value) || value < minValue || value > maxValue) {
        numericInput.style.border = '1px solid red';
        return;
      }
      numericInput.style.border = '';
      settings.set(id, numericInput.value);
    });
  });

  document.querySelector('.license-toggle').addEventListener('click', (event) => {
    (document.querySelector('#license') as HTMLElement).style.display = 'block';
    (document.querySelector('.license-toggle') as HTMLElement).style.display = 'none';
    return nothing(event);
  });

  translateDocument(window.document);
}(SettingsFactory.create(), window.chrome));
