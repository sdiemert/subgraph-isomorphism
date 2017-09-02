"use strict";
const math = require('mathjs');

function arraySum(A) {
    return A.reduce((acc, val) => {
        return acc + val;
    });
}

function num_rows(M) {
    return M.length;
}

function num_cols(M) {
    return M[0].length;
}

function array2DCopy(A) {

    let X = [];

    for (let i = 0; i < A.length; i++) {
        X[i] = A[i].slice();
    }

    return X;
}

function checkSquareMatrix(A) {

    const s = A.length;

    for (let i = 0; i < s; i++) {
        if (A[i].length !== s) return false;
    }

    return true;
}

function mapPtoG(M) {
    return function (p) {
        const cols = num_cols(M);
        for (let c = 0; c < cols; c++) {
            if (M[p][c] === 1) return c;
        }
    }
}

function isIso(M, G, P) {

    const rows = num_rows(P);

    const morph = mapPtoG(M);

    for (let r1 = 0; r1 < rows; r1++) {

        for (let r2 = 0; r2 < rows; r2++) {

            // adjacent in P
            if (P[r1][r2] === 1) {

                // find mapped nodes in G
                let c1 = morph(r1);
                let c2 = morph(r2);

                // are they adjacent in G?
                if (G[c1][c2] !== 1) {
                    // no - not isomorphism
                    return false;
                }

            }
        }

    }

    return true;

}

function recurse(used_columns, cur_row, G, P, M, out, num) {

    const cols = num_cols(M);

    if (cur_row === num_rows(M)) {

        if (isIso(M, G, P)) {
            out.push(array2DCopy(M));
        }

    } else {

        let Mp = array2DCopy(M);

        // for all unused columns c
        for (let c = 0; c < cols; c++) {

            // only explore if the nodes are candidates for matching and the
            // column has not been set yet.
            if (used_columns[c] === 0 && M[cur_row][c] === 1) {

                //set column c in M' to 1 and other columns to 0
                for (let i = 0; i < cols; i++) {
                    if (i === c) {
                        Mp[cur_row][i] = 1;
                    } else {
                        Mp[cur_row][i] = 0;
                    }
                }

                // mark c as used
                used_columns[c] = 1;

                // recurse, but only if they want to find more isomorphisms.
                if(num === null || out.length < num){
                    recurse(used_columns, cur_row + 1, G, P, Mp, out, num);
                }

                // mark c as unused
                used_columns[c] = 0;

            }
        }
    }

}


/**
 * Determines if the nodes P[p] and G[g] are similar enough
 * to be candidates for an isomorphic mapping.
 *
 * This is the default implementation which uses the degree of
 * the nodes to determine similarity.
 *
 * @param P {number[][]}
 * @param G {number[][]}
 * @param p {number}
 * @param g {number}
 * @returns {boolean} true if they are similar enough, false otherwise.
 */
function degreeCriteria(P, G, p, g) {

    let p_i_deg = arraySum(P[p]);
    let g_j_deg = arraySum(G[g]);
    return (p_i_deg <= g_j_deg);
}

function initMorphism(G, P, criteriaFun) {

    const P_size = P.length;
    const G_size = G.length;

    criteriaFun = criteriaFun || degreeCriteria;

    // M is |V_p| X |V_G| matrix (p rows, g cols)
    let M = math.zeros(P_size, G_size).toArray();

    for (let i = 0; i < P_size; i++) {

        for (let j = 0; j < G_size; j++) {

            if (criteriaFun(P, G, i, j)) {
                M[i][j] = 1;
            }
        }
    }

    return M;
}

/**
 * Finds isomorphisms (mappings) of a subgraph in a host/mother graph.
 *
 * The subgraph algorithm is based on: http://adriann.github.io/Ullman%20subgraph%20isomorphism.html
 *
 * This algorithm is exponential and will be slow for large inputs.
 *
 * @param G {number[][]} Adjacency matrix of the host/mother graph in which to search for a match.
 * @param P {number[][]} Adjacency matrix of subgraph to search for
 * @param maxNum {number} [null] the maximum number isomorphisms to find, may return fewer if fewer are matched.
 * @param similarityCriteria {function} [degreeCriteria] a function used to determine if two nodes are similar enough to be candidates for matching in the resulting morphism.
 *
 * @returns {number[][][]} an array of morphism matrices (rows indices correspond to vertices of P, col indices correspond to vertices of G), null if error.
 */
function getIsomorphicSubgraphs(G, P, maxNum, similarityCriteria) {

    const G_size = G.length;
    const P_size = P.length;

    // No match possible if |P| > |G|, not an error.
    if (G_size < P_size) return [];

    // They don't want a match, not an error.
    if (maxNum !== null && maxNum !== undefined && maxNum <= 0) return [];

    // Input adjacency matrices must be square, error if not
    if(!checkSquareMatrix(G)) return null;
    if(!checkSquareMatrix(P)) return null;

    // set to null by default
    maxNum = maxNum || null;

    let M = initMorphism(G, P, similarityCriteria);

    let results = [];

    recurse(math.zeros(1, G_size).toArray()[0], 0, G, P, M, results, maxNum);

    return results;
}


module.exports = {
    getIsomorphicSubgraphs: getIsomorphicSubgraphs,
    priv                  : {
        initMorphism     : initMorphism,
        degreeCriteria   : degreeCriteria,
        recurse          : recurse,
        isIso            : isIso,
        mapPtoG          : mapPtoG,
        arraySum         : arraySum,
        checkSquareMatrix: checkSquareMatrix
    }
};
