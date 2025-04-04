/**
 * Chunks a message into parts of maximum 2000 characters (Discord's message limit)
 * @param {string} msg - The message to chunk
 * @returns {string[]} Array of message chunks
 */
export function chunkResponse(msg) {
  return msg.match(/[\s\S]{1,2000}/g);
}
