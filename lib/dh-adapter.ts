/**
 * PLACEHOLDER: Discovering Hands (DH) knowledge-management integration adapter.
 *
 * The real integration is out of scope for this prototype. This interface marks
 * where course content, translations and certification records would be
 * synchronised with the DH knowledge system.
 */
export interface DhKnowledgeAdapter {
  /** Pull the latest approved course + lesson content. */
  fetchCourseCatalogue(locale: string): Promise<unknown[]>;
  /** Pull translated strings keyed like the `translations` table. */
  fetchTranslations(locale: string): Promise<Record<string, string>>;
  /** Push a certification record for quality assurance. */
  publishCertification(input: { userId: string; issuedAt: string; expiresAt: string }): Promise<void>;
}

export const dhAdapter: DhKnowledgeAdapter = {
  async fetchCourseCatalogue() {
    return []; // TODO: call DH knowledge management API
  },
  async fetchTranslations() {
    return {}; // TODO
  },
  async publishCertification() {
    /* TODO */
  },
};
