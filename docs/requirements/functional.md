# Application Functional Requirements

## User Authentication

### Registration and Login
1. The application shall allow a user to register a new account using an email address and password.
2. The application shall validate that the email address is in a valid format before accepting registration.
3. The application shall require passwords to be at least 8 characters long and contain at least one number and one special character.
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
12. The application shall link social login accounts with existing email accounts if the email matches.

## Content Management

### Content Creation and Editing
13. The application shall allow authenticated users to create new content posts.
14. The application shall allow users to edit their own content within 24 hours of posting.
15. The application shall allow users to delete their own content at any time.
16. The application shall preserve deleted content in the database but hide it from public view.

### Content Formatting
17. The application shall support rich text formatting including bold, italic, and hyperlinks.
18. The application shall allow users to embed images within their content.
19. The application shall limit image uploads to 5MB per image.
20. The application shall support markdown syntax for content formatting.

### Content Organization
21. The application shall allow users to add up to 5 tags per content post.
22. The application shall allow users to select their country of residence from a predefined list.
23. The application shall automatically record the creation date and last modified date of all content.

## Search & Filtering

### Search Functionality
24. The application shall provide full-text search across all public content.
25. The application shall return search results within 2 seconds.
26. The application shall highlight matching search terms in the results.

### Filtering Options
27. The application shall allow users to filter content by:
    - Single or multiple countries
    - One or more tags
    - Date range (within the last day, week, month, year)
    - Specific author
28. The application shall allow multiple filters to be applied simultaneously.
29. The application shall display the current active filters to the user.
30. The application shall allow users to clear all filters with a single action.

## User Interactions

### Voting System
31. The application shall allow authenticated users to upvote or downvote each content post once.
32. The application shall allow users to change their vote or remove it.
33. The application shall display the net vote count (upvotes minus downvotes) on each post.

### Comments
34. The application shall allow authenticated users to add comments to any content post.
35. The application shall allow users to edit their own comments within 1 hour of posting.
36. The application shall allow users to delete their own comments at any time.
37. The application shall support nested comments up to 3 levels deep.

### Notifications
38. The application shall notify users when:
    - Their content receives a comment
    - Their comment receives a reply
    - Their content receives an upvote
39. The application shall allow users to mark notifications as read.
40. The application shall allow users to configure which notifications they receive.
41. The application shall display a notification count in the navigation bar.