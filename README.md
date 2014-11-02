# Map Processing Code for TagPro

These scripts allow for processing of a TagPro tiles array with the result being a functional navigation mesh that can be incorporated into bots.

parse-map contains the mapParser, whose parse function takes in the tagpro.map object and returns a set of polygons representing the various shapes making up the map.

navmesh contains the NavMesh, which takes in the output from parse-map above (after being converted to polygons, see demo.js), splits the walkable area into convex polygons, and generates the necessary information such that paths can be found between points on the map.

polypartition has various classes and methods useful for geometry.

poly2tri and priority-queue are dependencies of some of the above.

This project uses RequireJS for dependency management.


# Usage

If your current project uses git for version control, [Subtree Merging](http://git-scm.com/book/en/v1/Git-Tools-Subtree-Merging) is an effective way to incorporate these scripts into your project while still being able to pull in updates as they occur.

# To do

* Handle diagonal tiles in initial map parsing.
* Allow for weighted values when considering a path (updated based on e.g. the number of opponents in an area in the case where you have the flag, an opponent with tagpro, the relative ability of opponents.).
* More accurate polygon representing spike objects.
* Real-time map updating based on gate/portal availability.
* Tracking portal<->portal and button<->gate associations as they are learned.
