import * as ig from './global.js';

export default (() => {

  function init() {
    _searchLegacyCode();
  }

  function _searchLegacyCode() {

// GLOBALS
    var modelUrl = 'https://search.investorsgroup.com/api/cwpsearch?';
    var $field = $('#FindAnOffice');
    var lang = 'en';
    if (window.location.href.indexOf('/fr/') > -1) {
      lang = 'fr';
    }

// Process the local prefetched data
    var suggestions = {};
    suggestions.locations = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: 'data/cities.json'
    });

// Get the results
    function getSearchResults(params) {
      params.searchtype = 'office';
      params.name = '';

      // Make sure error message is hidden each time
      $('.zero-results').addClass('hide');

      $.getJSON(modelUrl, params)
        .always()
        .done(function (data) {
          var result = JSON.parse(data);
          if (result.length) {
            $('body').addClass('is-reveal-open');
            $('#searchResultsModal').removeClass('closed').html('');
            displaySearchResults('office-template', result);
          } else {
            $('.zero-results').removeClass('hide');
          }
        })
        .fail(function (result) {
          console.log('Data could not be retrieved, please try again', result.status + ' ' + result.statusText);
        });

    }

// Because we are only searching for cities, this function is slightly redundant - leaving it in place for now
    function parseSearchString() {
      var result = {};
      var search = $field.val();

      result.city = '';

      // Search in the language of the page
      result.lang = lang;
      // We only search consultants from this method
      result.searchtype = 'con';

      // Check the search string for a previously defined location
      var words = search.split(' ');
      for (var i = 0; i < words.length; i++) {
        // Check each word for a city from the predefined list
        var city = suggestions.locations.get(words[i]);
        if (city.length > 0) {
          result.city = city[0];
          words.splice(i, 1);
        }
      }

      if (!result.city) {
        result.city = words.join(' ');
      }

      return result;
    }

    function displaySearchResults(templateID, json) {
      var template = document.getElementById(templateID).innerHTML;
      Mustache.parse(template);
      var rendered = Mustache.render(template, json);
      $('#searchResultsModal').append(rendered);
      $(document).foundation();
    }

//Init everything
    $(function () {
      // Try to predetermine what results should show
      // Setup the typeahead
      $('.typeahead').typeahead({
          highlight: true
        },
        {name: 'locations', source: suggestions.locations, limit: 2}
      );

      // Setup the form submission
      $('.search-form').submit(function (e) {
        e.preventDefault();
        var params = parseSearchString();
        getSearchResults(params);
      });

      // Fake modal - Adding handler on document so it fires despite the button not being rendered yet
      $(document).on("click", "#searchResultsModal .close-button", function () {
        $('#searchResultsModal').addClass('closed');
        setTimeout(function () {
          $('body').removeClass('is-reveal-open');
        }, 400);
      });
    });
  }

  return {
    init
  };
})()