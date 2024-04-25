### What did I change:
_Think of this more at a technical level vs feature level. We have the original Linear ticket for the feature functionality on what we are trying to accomplish. A PR is a technical review of your code. What did you change and what value did you add? Did you refactor something? Why was it refactored? How was it refactored? Did you add new functionality? Did you use a different code construct then you typically do to optimize for future changes you know are coming? Think of this as the final version of the thought process you used to break down and process the ticket itself.
Linear = functional audit trail, PR = technical audit trail_
 
### QA Notes:
_If the code you changed is related to another task or object that already exists this would be where you would indicate to QA places that they need to pay extra attention to in testing. Example: If I am modifying something related to an activity that is used  for the ongoing activity plan but we use that same type of activity in initial ingest or to trigger other actions. I would indicate that there is shared code between these two items. So that when QA tests this ticket they know that they need to pay close attention to initial ingest even though the ticket itself was for the ongoing activity plan.
  Also note here if you refactored any code vs just making the change related to the ticket so QA knows that they need to pay attention to the whole feature that the change is in vs more focus on the change itself._

### Related Tickets:
_This should only contain one ticket per PR but there can be cases that this would include more than one. Your PR should auto link the ticket that you are working on with the branch name but that will only attach that ticket. So if it is related to multiples or is blocked by another ticket or needs to be merged with another ticket this is where you would indicate this._

_Example:_
  
  _Blocked by: LINEAR-101 (Used Linear for the example so it doesn't autopick up)_
  
  _Includes: LINEAR-102_

### Did you...
- [ ] test the code locally?
- [ ] run unit tests and updated to account for the changes?
- [ ] lint the code?
- [ ] format the code?
- [ ] test the code on staging?
