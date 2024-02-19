This represents every single pull request description for each challenge and the decisions made during the development.

# 1. Fix a bug

### PR Name: Fix launch date timezone on details page #1

### Purpose of this MR

* [X] Bugfix
* [ ] Feature
* [ ] Refactoring (no functional changes, no API changes)
* [ ] Tests

### Changes
- Added a second parameter to our format date utils to handle the timezone, this is a no-harm argument as it can be null fall backing to the user timezone.
- Used the timezone provided by the API on the launch date.
- Implemented the tooltip to show the date as in the user's timezone.
<img width="384" alt="Screenshot 2024-01-02 at 18 51 06" src="https://github.com/pleo-careers/pleo-frontend-challenge-caionnx/assets/12668818/21206644-8337-4603-b6d3-a3f3a5eee0cb">

### How to test it

1. Open the launch details page for a launch (e.g `/launches/62dd70d5202306255024d139`)
2. Hover through the launch date.

### Related issue
The ticket link goes here
### Reviewers
My teammates or developers related to the change will be tagged here

# 2. Build a feature

### PR Name: Add feature of favorite launches and launch pads #2

### Purpose of this MR

* [ ] Bugfix
* [X] Feature
* [ ] Refactoring (no functional changes, no API changes)
* [ ] Tests

### Changes
Introducing the ability to favorite Launches and Launch Pads 🙌 

- A user can mark - "star" - launches or launch pads as favorites - both from the list and details page for all items
- A list of favorites is available as a slide-in drawer
- From the list, the user can navigate to the favorite items
- The user is able to remove items from the list (from within the list and on the details page of an item that is currently in the list)
- The list is persisted after the app is closed (but everything is stored locally for now)

#### Product/Design Decisions
- The star (or favorite button) was placed alongside the title on both lists to favor visibility (IMO being placed on the top right corner could be harmful depending on the image behind, we would need a background in the button in that case).
- To trigger the drawer, a main trigger button was placed on the navigation bar, this decision was made to make the favorites list available from anywhere and not only on the list. This trigger acts as a shortcut so the user can navigate quicker from a specific Launch page to another one via Favorites.
- On the list of favorites each item has a link that redirects the user to the favorited item page (as each item only displays the most relevant information).
- The list has a fixed order of Launches and below Pads.
- The order of the items being displayed in each section is by the time of addition, meaning first favorited items appear first and last favorited items appear by the end of the list.
- If the user has no favorite Launches or Pads a message on the drawer is displayed encouraging engagement with the feature with call-to-action buttons.

#### Engineering Decisions
- Maintained the coding style and naming conventions already existing on the project (we could discuss in a bigger forum if changes in the aspect could be beneficial).
- LocalStorage was the choice of "database" to store the list of favorites. This is because in my judgment the structure and the size of the data we are storing are not complex/large so this is a straightforward solution for this case. On the other hand, if the feature grows in the feature and we want to store it on a real database (or IndexdDB) the logic will be centralized on one point so the cost of migration is not high. 
- A Provider was created to handle the logic of manipulating the local storage to avoid duplication of code and to have features centralized in one place.
- Similar to the previous point, and leveraging the context pattern, the FavoriteButton component has the same principle so the logic of favoriting is the same for different pages(Launches/Launch/...), and the pages do not have to deal with the functionality itself.
- Unit tests were added only to the new components (IMO this should be the practice until we can add testing for the components that already exist + discuss a further QA strategy for the project).

#### Concerns
- The queries to fetch data are being triggered every time the user opens the drawer. We can optimize in the future to avoid this or discuss our caching strategy.
- The same happens on launches or launch pads query when a rerender is triggered (like closing the drawer).

### How to test it

1. Open up the home page
2. Click on 'My Favorites' on the navbar and check there is no favorited item.
3. Use the CTA to go to the Launches page.
4. On the Launches page favorite a few launches.
5. Open up again the Favorites drawer, check the same items are now favorited.
6. Refresh the page and check the favorited items are persisted.
7. Repeat the steps but for Launch Pads.
8. Check that the user can favorite and unfavorite a launch or launchpad from each individual page.

https://github.com/pleo-careers/pleo-frontend-challenge-caionnx/assets/12668818/f5ea7e4a-43ea-41b0-8f0c-3a7bc3afabdc


### Related issue
The ticket link goes here
### Reviewers
My teammates or developers related to the change will be tagged here

# 3. Impress us

### PR Name: Add rockets page and search for Launches #3

### Purpose of this MR

* [ ] Bugfix
* [X] Feature
* [ ] Refactoring (no functional changes, no API changes)
* [ ] Tests

### Changes
Introducing two new features: Rockets Page and Search of Launches 🚀 

---

A full circle of information is now possible with the brand-new Rockets Page. We love Rockets, it is in our app name but it was missing in favor of other developments. Now from the Launch Pad page, the user can navigate and see specific details of a Rocket, and the same can be achieved from a Launch page.

I decided to build this feature as it seems to me (from the user's perspective) that rockets are a crucial part of the love for space. It was also a good opportunity to test how easily the Favoriting functionality could be implemented in a different context.

---

The second feature is introduced to mitigate a pain point for the users when navigating the launches page: there are too many launches and can be hard for the user to find a specific launch. To tackle it this MR is introducing the Search capability on the Launches page where the user can easily refine the list of results by searching for a Launch's name.

The decision to not include the search on the other pages was due to the lower payload size in the other cases.

Even though the search is debounced to reduce the number of queries being made, limiting the size of the search string, and what impact it can have on the API, was not taken into consideration due to time constraints

#### Questions for future discussion
- We can discuss further if we should add Search for Pads and Rockets pages, the effort would not be high.
- I would like to discuss improvements in the Search capability in terms of fields the user can refine.

#### Other ideas not followed by constraints
- Reddit comments on the app: the idea would be to have the comments of Reddit users on the page of a Launch to show to the user how the community is engaging with a Launch. The constraint in this case is that we would need a new API to serve as an authenticator gate to consume Reddit's API.
- Calendar with upcoming launches: to engage future visits from the users. Unfortunately, the SpaceX API we are using is not being maintained anymore so the data would never show future events de facto.

### How to test it
Rockets
- Open the home page.
- Navigate through the new link to browse Rockets.
- Check the user can see the list of rockets that are visible and easy to understand.
- Check users can navigate to a specific Rocket page to see details about the spaceship.
- Check the user can favorite a Rocket the same as Launches and Pads.

Search
- Open Launches page.
- Type a Launch name in the search box.
- Check that the results presented are a match for the searched term.
- Type a different value, maybe "banana" to see that a message is displayed if no results were found.

### Related issue
NA
### Reviewers
My teammates or developers related to the change will be tagged here