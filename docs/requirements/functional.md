# Application Functional Requirements

## User Authentication

### Registration and Login
1. The application shall allow a user to register a new account using an email address and password.
2. The application shall validate that the email address is in a valid format before accepting registration.
3. The application shall require passwords to be at least 8 characters long.
4. The application shall prevent registration with an email address that is already in use.
5. The application shall allow users to log in using their registered email and password.
6. The application shall allow users to log out from any page in the application.
7. The application shall automatically log out users after 24 hours of inactivity.

### Password Management
8. The application shall allow users to request a password reset via email.
9. The application shall expire password reset links after 1 hour.
10. The application shall require users to confirm their current password before changing to a new password.

### Social Authentication
11. The application shall allow users to register and login using their Google account.

## Content Management

### Content Creation and Editing
12. The application shall allow authenticated users to create new content posts.
13. The application shall allow users to edit their own content.
14. The application shall allow users to delete their own content.
15. The application shall preserve deleted content in the database but hide it from public view.
    <details>
    <summary>Specification</summary>
    15.1 Server-side `Content` model has a `show` field set to `true` by default  
    15.2 Server-side `contentController` function `deleteContent()` sets `show: false`  
    15.3 Client-side `content.js` store function `getContents()` filters by `show: true`  
    15.4 Server-side `contentController` function `getContentsByUserId()` filters by `show: true`
    </details>

### Content Organization
16. The application shall allow users to add up to 5 tags per content post.
17. The application shall allow users to select the corresponding country from a list.
18. The application shall automatically record the creation date and last modified date of all content.

## Search & Filtering

### Search Functionality
19. The application shall provide full-text search across all public content.
20. The application shall return search results within 2 seconds.

### Filtering Options
21. The application shall allow users to filter content by:
    - Single or multiple countries
    - One or more tags
22. The application shall allow multiple filters to be applied simultaneously.
23. The application shall display the current active filters to the user.
24. The application shall allow users to clear all filters with a single action.

## User Interactions

### Voting System
25. The application shall allow authenticated users to upvote or downvote each content post once.
26. The application shall allow users to change their vote or remove it.
27. The application shall display the net vote count (upvotes minus downvotes) on each post.

### Comments
28. The application shall allow authenticated users to add comments to any content post.
29. The application shall allow users to delete their own comments at any time.

### Notifications
30. The application shall notify users when:
    - Their content receives a comment
    - Their comment receives a reply
    - Their content receives an upvote
31. The application shall allow users to mark notifications as read.
32. The application shall allow users to configure which notifications they receive.
33. The application shall display a notification count in the navigation bar.