"use strict";
/**
 * Module for generating random graphs.
 */

var math = require("mathjs");

/**
 * Generates a graph with n nodes and m edges
 * randomly assigned between nodes.
 *
 * @param n {number} the number of nodes in the graph
 * @param m {number} the number of edges in the graph
 *
 * @precondition m <= n*(n-1)
 *
 * @returns {number[][]} an n x n adjacent matrix, returns null if error.
 */
function generateGraph(n, m){

    if(m > n*(n-1)) return null;

    let M = initMatrix(n);

    let edgeCount = 0;

    let rSrc = null;
    let rTar = null;

    while(edgeCount < m){

        // randomly select 2 nodes (source and target) and draw an edge between them
        // only use node pairings that do not have edge between them already.

        rSrc = randomRange(0, n);
        rTar = randomRange(0, n);

        if(M[rSrc][rTar] !== 1){
            M[rSrc][rTar] = 1;
            edgeCount++;
        }

    }

    return M;

}

/**
 * Creates an empty adjacent corresponding to a graph with
 * n nodes and 0 edges.
 *
 * @param n {number} the number of nodes in the graph.
 *
 * @precondition n > 0
 *
 * @return {number[][]} the adjacency matrix
 */
function initMatrix(n){
    return math.zeros(n,n).toArray();
}

/**
 * Returns a random integer between x and y (inclusive)
 *
 * Uses JavaScript's native Math.random generator.
 *
 * @param x {number}
 * @param y {number}
 *
 * @precondition x < y
 *
 * @return {number}
 */
function randomRange(x, y){
    return Math.floor(x + (Math.random() * (y - x)));
}

module.exports = {
    generateGraph : generateGraph
};