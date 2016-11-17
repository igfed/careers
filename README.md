# IG-mortgage-pages

Notes
-----
- header is presumed to be developed separately; the absolute positioning has been removed
- footer has been added as a placeholder
- a required class has been added to the body element ('IGv2')
- other HTML changes are contained within the following tags:
	- <!-- IG|SA: START content block -->
		and
	- <!-- IG|SA: END content block -->
- no new JS or CSS have been added with the following caveats:
	- this assumes that mortgage-additional.scss will be compiled with the main css file
	- mortgage.js was altered, and it is assumed this will be present on all mortgage pages
- rates:
	- is the 'mortgageBaseRate' value the one to use? Seems so from the original JS
	- assuming for landing page:
		- variable = "mortgageTypeName": "Variable"
		- no subnote = "mortgageTypeName": "Fixed"
		- adjusted = "mortgageTypeName": "ARAP"
		*** should these be dynamic, or static? They appear in the copy deck as if they needed correction
	- had to use "mortgageProductId" for identifier, as no other info seemed reliable across products; ideal would be a term and type
	- so far, no rounding rules on rates
	- for rates pages, most rates state 'open', though the names in the data file predominantly state 'closed'
	- I have changed the label on the variable rate mortgage section to 'variable'; please confirm
	- rate page base rates are _not_ dynamic
- analytics have not been altered
- when inconsistency was noted between PSDs or with PSDs and established structures, generally consistency across mortgage was taken as first priority, with parity with established structures as secondary; parity with established font sizing was typically sought ahead of matching PSDs
- confirm interpretation of 'Mortgage disclaimer' on landing page (copy/paste from rates page) is correct

Post-feedback comments
-----
- landing
	- need 'full mortgage disclaimer' -- I am not sure of what this copy is
- rates
	- re: 'Variable Rate & Adjustable Rate' flow:
		- the PSD content width is 1200px; this needs to flow for screens smaller than 1400px but larger than 'small' (640px)
		- max width has been set to match PSD
	- re: 'Solutions banking - Missing icon/illustration':
		- Steve, this may be due to not moving over the images from the repo; please check or let me know if action needs to be taken
	- re: spacing on 'solutions banking':
		- original version matched PSD; please confirm new values
- all in one
	- re: missing illustration:
		- see 'Missing icon/illustration' above
	- re: rate whitespace:
		- spacing matches PSD; please specify new values

FAQ comments
-----
- added image landing/images/icons/info.png
- for the table, I did not go too far in customizing this, as there is no design analog, and assume there may be input