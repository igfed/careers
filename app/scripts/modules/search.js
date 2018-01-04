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
    var cities = [
      "athabasca",
      "bluffton",
      "bonnyville",
      "brooks",
      "calgary",
      "camrose",
      "canmore",
      "drayton valley",
      "edmonton",
      "fort mcmurray",
      "fort saskatchewan",
      "grande prairie",
      "halkirk",
      "hillcrest mines",
      "hinton",
      "leduc",
      "lethbridge",
      "lloydminster",
      "medicine hat",
      "morinville",
      "peace river",
      "pincher creek",
      "provost",
      "red deer",
      "sherwood park",
      "spruce grove",
      "st. albert",
      "stettler",
      "sturgeon county",
      "tofield",
      "vermilion",
      "wainwright",
      "westlock",
      "whitelaw",
      "abbotsford",
      "brackendale",
      "burnaby",
      "burns lake",
      "campbell river",
      "chase",
      "chilliwack",
      "comox",
      "coquitlam",
      "courtenay",
      "cranbrook",
      "dawson creek",
      "duncan",
      "fort nelson",
      "fort st. john",
      "invermere",
      "kamloops",
      "kelowna",
      "langley",
      "merritt",
      "nanaimo",
      "nelson",
      "north vancouver",
      "oliver",
      "penticton",
      "port alberni",
      "powell river",
      "prince george",
      "qualicum beach",
      "quesnel",
      "revelstoke",
      "richmond",
      "saanichton",
      "salmon arm",
      "salt spring island",
      "sechelt",
      "sidney",
      "smithers",
      "surrey",
      "terrace",
      "trail",
      "vancouver",
      "vernon",
      "victoria",
      "westbank",
      "williams lake",
      "brandon",
      "dauphin",
      "flin flon",
      "gillam",
      "killarney",
      "manitou",
      "miami",
      "morden",
      "narol",
      "portage la prairie",
      "selkirk",
      "swan river",
      "the pas",
      "virden",
      "warren",
      "winnipeg",
      "bathurst",
      "bedell",
      "edmundston",
      "fredericton",
      "lansdowne",
      "miramichi",
      "moncton",
      "quispamsis",
      "rexton",
      "rothesay",
      "saint john",
      "saint paul",
      "sussex",
      "blaketown",
      "clarenville",
      "corner brook",
      "gander",
      "grand falls - windsor",
      "marystown",
      "roaches line",
      "st. john's",
      "trinity",
      "amherst",
      "antigonish",
      "barrington passage",
      "belliveau cove",
      "bridgetown",
      "bridgewater",
      "dartmouth",
      "dayton",
      "halifax",
      "middleton",
      "new glasgow",
      "new minas",
      "north sydney",
      "pictou",
      "port hawkesbury",
      "sydney",
      "truro",
      "yellowknife",
      "ajax",
      "algonquin highlands",
      "ancaster",
      "atikokan",
      "barrie",
      "belleville",
      "bowmanville",
      "bracebridge",
      "brampton",
      "brantford",
      "brockville",
      "brooklin",
      "burlington",
      "cambridge",
      "carleton place",
      "chatham",
      "clayton",
      "clinton",
      "cobourg",
      "collingwood",
      "concord",
      "cornwall",
      "dryden",
      "dundas",
      "dunsford",
      "dutton",
      "elliot lake",
      "etobicoke",
      "fort frances",
      "gananoque",
      "garson",
      "greely",
      "grimsby",
      "guelph",
      "haileybury",
      "hamilton",
      "hanover",
      "hearst",
      "huntsville",
      "jerseyville",
      "kanata",
      "kapuskasing",
      "kenora",
      "kingston",
      "kirkland lake",
      "kitchener",
      "langton",
      "lindsay",
      "london",
      "maple",
      "marathon",
      "markham",
      "merrickville",
      "milton",
      "minden",
      "mississauga",
      "mount forest",
      "mount hope",
      "nepean",
      "new liskeard",
      "newmarket",
      "niagara falls",
      "north bay",
      "north york",
      "oak ridges",
      "oakville",
      "orangeville",
      "orillia",
      "orton",
      "oshawa",
      "ottawa",
      "owen sound",
      "parry sound",
      "pembroke",
      "penetanguishene",
      "perth",
      "peterborough",
      "petrolia",
      "pickering",
      "red lake",
      "ridgetown",
      "sarnia",
      "sault ste. marie",
      "scarborough",
      "schreiber",
      "simcoe",
      "sioux lookout",
      "st. catharines",
      "st. marys",
      "stouffville",
      "stratford",
      "sturgeon falls",
      "sudbury",
      "sundridge",
      "thunder bay",
      "tillsonburg",
      "timmins",
      "toronto",
      "trenton",
      "Uxbridge",
      "val caron",
      "walkerton",
      "waterloo",
      "welland",
      "whitby",
      "willowdale",
      "windsor",
      "wingham",
      "woodbridge",
      "charlottetown, pe",
      "souris, pe",
      "summerside, pe",
      "wellington",
      "anjou",
      "boisbriand",
      "boucherville",
      "brossard",
      "châteauguay",
      "chicoutimi",
      "côte saint-luc",
      "dollard-des-ormeaux",
      "gatineau",
      "granby",
      "laval",
      "lévis",
      "mirabel",
      "montreal",
      "new richmond",
      "pointe-claire",
      "québec",
      "sept-iles",
      "sherbrooke",
      "ville st-laurent",
      "westmount",
      "eastend",
      "estevan",
      "esterhazy",
      "foam lake",
      "humboldt",
      "kindersley",
      "leader",
      "maple creek",
      "meadow lake",
      "melfort",
      "melville",
      "moose jaw",
      "north battleford",
      "outlook",
      "oxbow",
      "prince albert",
      "regina",
      "regina beach",
      "rosetown",
      "saskatoon",
      "shellbrook",
      "swift current",
      "watrous",
      "watson",
      "yorkton",
      "whitehorse"
    ];
    suggestions.locations = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: cities
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

          // Adobe Analytics
          window.digitalData.event.searchResults = result.length > 0 ? result.length : 0;
          window.digitalData.event.searchType = 'careers';
          window.digitalData.event.searchTerm = $field.val();
          _satellite.track('search_careers');

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
      }, {
        name: 'locations',
        source: suggestions.locations,
        limit: 2
      });

      // Setup the form submission
      $('.ig-search').submit(function (e) {
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