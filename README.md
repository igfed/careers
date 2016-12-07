Screen Review Pt. 2:

	- as the PDF was not at a resolution to compare pixel parity, the margin comments were used literally to alter the layout (e.g. 'Currently 91px Update to 100px' resulted in an increase of 9px on the margin); hopefully all these comments were relevant to the current state of the layout

	- some (e.g. above 'our edge') seemed to be correct already based on measuring at approximately the same place as the review, and were not altered... The assumption is, this measurement was taken for an interim state of development

	- for the overlay slides:

		- slides will have varying height, based on content; if the 'next' link is to float (fixed position), then it is currently in position, at least 35px below the text on the slide with the largest amount of content, when scrolled to the bottom. The spacing will increase based on window size, or content amount.

		There are three evident options for placement other than this:

		1) the next link is always positioned 35px below the text (static). This would mean that on short screens, the link would not be visible until scrolling to the bottom; this is possibly desireable. Also though, it would mean the button would be screen specific, likely sliding with the content, and definitely being in different positions vertically for different slides; I determined this would likely not be a desireable outcome

		2) the link is (absolutely) positioned 35px below the text of the slide with the largest amount of content. This means that the link would scroll with the content on short screens, not always being visible, but would always be in the same vertical position. It would only be 35px from content on the slide(s) with the largest amount of content, however; smaller amounts of content would have bigger gaps.

		3) use a fixed position with a programatically determined max 'height'. This would allow for scrolling when required, and would stay stationary at 35px for the slide with the most content, but would not be balanced on a tall screen

		I posed the following question to IG, and did not receive a response:

			"for the 'next' links in the modal, these currently float over the content; should this change to scrolling with the content, and be positioned to the right of the CTAs?"

		I have left the link as a (fixed) floating element, as a) it will always be visible, as navigation elements are typically expected to be, and b) since vertical scrolling is a behaviour that can be relied upon by a user, the link overlap with text is easily overcome, and c) fixed in the way it is, it satisfies the minimum 35px distance from text defined in the UX doc, though for the slide with the largest amount of content only.

		I should not be deciding this. Design should have a perspective on how to treat fluid content.

	- for profiles/our people's success:

		- non-absolutes ('may be better served') which require verification were not executed -- designation combination also has a high effort overhead, so an absolute would need to be provided

		- for 'content to be removed...text stays', I have altered some positioning to accommodate; this can be reverted by looking for 'REMOVALS|SA' signature comments in the scss file. I should not be deciding the appearance of related elements in a design when elements are removed; design should provide a perspective on this

		- for 'UI will supply updated arrow styles', I have programatically changed arrow colour to the high contrast mobile version to be more visible on the profile slides as there was no direction supplied

		- for 'Spacing of dates', consistent is not defined; this should be resolved in copy in order to match original PSDs

		- for 'Slider transitions', not sure if this is old feedback; durations were reduced by 1/2 for all animations in the last change. With the removal of the radial counters (with a longer duration for effect), transitions seem rather rapid, so assuming this feedback is outdated; please confirm

	- 2nd section of 'our business':

		- normalized to 322px at 1400 viewport width; responsive from here

	- mobile profile:

		- 'Current 206px Update to 50px': this varies based on content amount when in the slider; the largest content slide has a 50px distance here