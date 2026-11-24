// Public certificate fingerprints only. Never place a signing key here.
export function androidAssociation(fingerprints: string | undefined) {
  const values = (fingerprints || "").split(",").map(value => value.trim()).filter(Boolean);
  if (!values.length || values.some(value => !/^(?:[A-Fa-f0-9]{2}:){31}[A-Fa-f0-9]{2}$/.test(value))) return null;
  return [{ relation: ["delegate_permission/common.handle_all_urls"], target: {
    namespace: "android_app", package_name: "com.naijafootballnetwork.app",
    sha256_cert_fingerprints: [...new Set(values.map(value => value.toUpperCase()))],
  } }];
}
