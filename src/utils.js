export const uidRegex = /\(\([^\)]{9}\)\)/g;
export const pageRegex = /\[\[.*\]\]/g; // very simplified, not recursive...
const excludingTitleRegex = /\"|\\/;

// export function getBlocksIncludingRef(uid) {
//   return window.roamAlphaAPI.q(
//     `[:find ?u ?s
//          :where [?r :block/uid ?u]
//               [?r :block/refs ?b]
//                 [?r :block/string ?s]
//             [?b :block/uid "${uid}"]]`
//   );
// }

// export function getLinkedRefsCount(uid) {
//   return window.roamAlphaAPI.q(
//     `[:find (count ?b)
//          :where [?r :block/uid "${uid}"]
//               [?b :block/refs ?r]]`
//   )[0][0];
// }

// export function countBlocksIncludingRef(uid) {
//   return window.roamAlphaAPI.q(
//     `[:find (count ?u)
//          :where [?r :block/uid ?u]
//               [?r :block/refs ?b]
//             [?b :block/uid "${uid}"]]`
//   )[0][0];
// }

export function getBlocksIncludingRefByTitle(title) {
  if (excludingTitleRegex.test(title)) {
    //   //title = title.replace('"', '\\"');
    return 0;
  }
  let result = window.roamAlphaAPI.q(
    `[:find (count ?b)
      :where [?r :node/title "${title}"] 
           [?b :block/refs ?r]]`
  );
  if (result.length > 0) return result[0][0];
  else return 0;
}

export function insertAfter(existingNode, newNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

export function isVoidPage(uid) {
  let children = window.roamAlphaAPI.pull("[:block/children]", [
    ":block/uid",
    uid,
  ]);
  if (children) {
    if (children[":block/children"].length == 1) {
      let r = getStringById(children[":block/children"][0][":db/id"]);
      if (r.trim().length == 0) return true;
    } else return false;
  } else return true;
}

export function getStringById(id) {
  return window.roamAlphaAPI.pull("[:block/string]", id)[":block/string"];
}

export function getUidByPageTitle(title) {
  if (excludingTitleRegex.test(title)) {
    //   //title = title.replace('"', '\\"');
    console.log(title);
    return null;
  }
  let result = window.roamAlphaAPI.pull("[:block/uid]", [":node/title", title]);
  if (result) return result[":block/uid"];
  return null;
}
