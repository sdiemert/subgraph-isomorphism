## Subgraph Isomorphism Package

![](https://travis-ci.org/sdiemert/subgraph-isomorphism.svg)

A small package that finds isomorphic subgraph matches within a larger host/parent graph. More formally, for a parent graph $G$ and desired matching graph $P$, find a subgraph of $G$ that is isomorphic to $P$.

This package works on directed and bidirectional graphs.

This package uses Ullman's algorithm to enumerate possible subgraph matches and is based on the description provided here: [http://adriann.github.io/Ullman%20subgraph%20isomorphism.html](http://adriann.github.io/Ullman%20subgraph%20isomorphism.html).

It is possible there are bugs in my implementation! Please let me know if you find any :-).

**NOTE:** This algorithm will run very slowly on large graph inputs, make sure you test the package with a reasonable upper bound prior using.

### API

Only one api function exists:

```JavaScript
function getIsomorphicSubgraphs(G, P, maxNum, similarityCriteria);
```

* `G` - an adjacency matrix of the host/parent graph.
* `P` - an adjacency matrix of the desired matching graph.
* `maxNum` - stop the algorithm after finding this many matches, may stop without finding this many if fewer exist.
* `similarityCriteria` - a function reference to call to determine initial similarity between nodes, see `degreeCriteria()` for an example implementation that compares the degree of the candidate nodes.


### Installation

This package depends on:

* `mathjs` - to do some array manipulations (*required*)
* `mocha` - to run unit tests (*optional*).

Required packages are installed by default when using `npm install subgraph-isomorphism`.
