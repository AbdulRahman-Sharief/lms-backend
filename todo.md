- do not allow user to request more than one token every 10 mins.
- password forget/reset process.
- allow user to update his own email and verify that email through otp code sent to his email.
- allow user to update his own avatar when he is logged in.
- handle onDelete cascade.
- build like and dislike system.
- photo comments feature.
- separate courseData and course in db.
- consider adding \_id to all object fields in course model in order to be easy to update them.
- delete user process optimization.

code to update dependency_graph.gv file

```
 madge --dot --extensions ts src > dependency_graph.gv
```
