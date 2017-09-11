"use strict";
const generator = require("./graph-generator");
const iso = require("../index");
const now = require("performance-now");
const  fs = require("fs");

/**
 * @typedef {object} ExperimentResult
 * @property {number} num
 * @property {number} time in ms
 * @property {number} host-nodes
 * @property {number} host-edges
 * @property {number} sub-nodes
 * @property {number} sub-edges
 */

/**
 *
 * @param hostN {number} nodes in host graph
 * @param hostM {number} edges in host graph
 * @param subN {number} nodes in sub graph
 * @param subM {number} edges in sub graph
 *
 * @return {ExperimentResult}
 */
function run(hostN, hostM, subN, subM){

    const host = generator.generateGraph(hostN, hostM);
    const sub  = generator.generateGraph(subN, subM);

    const t0      = now();
    const results = iso.getIsomorphicSubgraphs(host, sub);
    const t1      = now();
    const t = (t1 - t0);

    return {
        "num" : results.length,
        "time" : t,
        "host-nodes" : hostN,
        "host-edges" : hostM,
        "sub-nodes" : subN,
        "sub-edges" : subM
    };
}

function expVaryEverything(){

    const fout = fs.createWriteStream("experiments/results/exp-out-vary-everything.csv", "utf-8");

    const MAX_HOST_NODES = 15;
    const MAX_SUB_NODES = 10;

    const REPEATS = 25;

    let result = null;

    let count = 0;

    for(let hn = 2; hn <= MAX_HOST_NODES; hn++){
        for(let sn = 2; sn <= MAX_SUB_NODES && sn <= hn; sn ++){
            for(let he = hn; he <= hn*(hn-1)/4; he++){
                for(let se = sn; se <= sn*(sn-1)/4; se++){

                    let t_s = 0;
                    let num_s = 0;

                   for(let i = 0; i < REPEATS; i++) {
                       result = run(hn, he, sn, se);
                       t_s += result["time"];
                       num_s += result['num'];
                   }

                   fout.write(
                           count +"," +
                           hn + "," +
                           he + "," +
                           sn + "," +
                           se + "," +
                           num_s/REPEATS + "," + t_s/REPEATS+
                           "\n"
                       );

                       count++;

                       console.log(count+"\t"+ hn+"\t"+ he+"\t"+ sn+"\t"+ se+"\t"+num_s/REPEATS +"\t"+ t_s/REPEATS);
                }
            }
        }
    }

    fout.end();
}

function expLargeHost(){

    const fout = fs.createWriteStream("experiments/results/exp-out-large-host-with-prune.csv", "utf-8");

    const REPEATS = 50;

    for(let i = 6; i <= 30; i = i + 2){

        let t_s   = 0;
        let num_s = 0;

        const host_edges = i*(i-1)/4;
        const sub_edges = 6;
        const sub_nodes = 5;

        for (let r = 0; r < REPEATS; r++) {

            let result = run(i, host_edges, sub_nodes, sub_edges);

            t_s += result.time;
            num_s += result.num;

            console.log(r + "\t"+i + "\t" + host_edges + "\t" + sub_nodes + "\t" + sub_edges + "\t" + result.num + "\t" + result.time );

        }

        fout.write(
            i + "," +
            host_edges + "," +
            sub_nodes + "," +
            sub_edges + "," +
            num_s / REPEATS + "," + t_s / REPEATS +
            "\n"
        );

    }

    fout.end();
}


// Main entry point.

//expVaryEverything();

expLargeHost();
