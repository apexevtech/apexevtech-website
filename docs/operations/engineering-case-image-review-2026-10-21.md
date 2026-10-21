# Engineering case image review

Review date: 2026-10-21

## Scope and permission record

The user previously confirmed cooperation with SAITER and explicitly answered that publication permission for the images had been obtained. This is a record of the user's confirmation, not an independently inspected license document. That later confirmation supersedes the `pending` media status in the earlier internal collection JSON. Customer endorsement, personal-image rights, delivery attribution and measured performance are not established by that confirmation.

The current request is to make a separate engineering-case interface. The source path was verified through the public navigation: `https://www.saiter.cn/about.html` -> Engineering Cases -> `https://www.saiter.cn/case/1689164677525954560.html`. All 18 case detail pages were fetched on the review date. A standard HTML parser extracted the actual image `src` attributes from each page's body; URLs were not guessed. Site logos, footer social graphics and unrelated navigation images were excluded before downloading.

All 21 body images were downloaded to ignored `output/research/saiter/engineering-cases-2026-10-21/` and individually inspected with `view_image`. Every candidate was under 1 MiB. No image was generated, cropped, retouched, blurred, relabeled or re-encoded. Existing blurring in some source originals was not treated as evidence of permission. This internal document and the ignored manifest retain provenance; source URLs are not needed in public website data or links.

## Assets Approved for the New Interface

These assets must remain associated with their actual case IDs. Do not substitute an approved photograph for an unrelated case without a photograph. Neutral equipment descriptions do not represent proof that APEX delivered the photographed project.

| Case | Public local path | Dimensions | Bytes | Visual finding |
| --- | --- | --- | --- | --- |
| 1 | `/assets/library/case-1-system.png` | 865x548 | 39,928 | Existing approved image of laboratory test cabinets; no identifiable person or customer mark observed. Reuse the existing local file. |
| 2 | `/assets/engineering-cases/case-2-portable-system.webp` | 1000x625 | 127,422 | Newly approved equipment-only view of a portable diagnostic instrument and stacked test loads. No visible person, plate, customer logo or promotional watermark observed. Equipment's original small markings remain unchanged. |
| 5 | `/assets/engineering-cases/case-5-laboratory-system.webp` | 1920x1200 | 140,964 | Newly approved equipment-only view of a portable instrument and laboratory cabinets. No visible person, plate, customer logo or promotional watermark observed. Equipment's original small markings remain unchanged. |
| 11 | `/assets/library/case-11-system.jpg` | 1000x626 | 152,828 | Existing approved view of vehicle-carried instruments. A hand is visible, but no identifiable person or vehicle plate. Reuse the existing local file. |
| 14 | `/assets/library/case-14-system.png` | 1000x626 | 92,466 | Existing approved production-line equipment view; station codes are present but no identifiable person or obvious customer logo observed. Reuse the existing local file. |

The new files were copied byte-for-byte from the extracted source assets. Although the source URLs end in `.png`, their downloaded payloads are WebP; the new local filenames use `.webp` to match the verified format. No image data was re-encoded. Existing library paths are retained for compatibility. SHA-256 hashes match the ignored downloaded originals:

| New local filename | SHA-256 |
| --- | --- |
| `case-2-portable-system.webp` | `20a2e4d644e77cc8219c4544b3da4e8dae6b225f3701e2c04dbff7f435bc8a65` |
| `case-5-laboratory-system.webp` | `3c3aa859d682b179834439043be329d1b8876aa5f2c2eda30ae0dc9bbd04d69c` |

## Primary Image Review by Case

Detail pages follow `https://www.saiter.cn/case_detail/{case_id}.html`. The asset URL below is the actual body image extracted from that case, not an image from its category or a neighboring entry.

| Case | Original body image | Decision and reason |
| --- | --- | --- |
| 1 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/8f1338f4-23fd-4ca3-ba4f-bf0aa8a2e85b.png | Approved; reuse existing local asset. |
| 2 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/c6844749-ad21-4499-b379-b7688d073570.png | Approved; new local asset. |
| 3 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/46e51184-1294-49d4-b4d2-676f698a74fa.png | Not published: charging-station name/branding and vehicle scene; avoid implying customer endorsement. |
| 4 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/443437a0-4caa-40be-89d0-a7d0bb22e5fc.jpg | Not published: multiple people and identifiable clothing/organization markings. |
| 5 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/8d8114eb-4ca4-4aa5-8aec-f9cebc00ae58.png | Approved; new local asset. |
| 6 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/761b4e14-8d27-4374-b8d0-3ae74a6f51db.jpg | Not published: identifiable people, State Grid-branded charging equipment and vehicle scene. |
| 7 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/7eb24625-f5d0-460c-83f7-89b2c807c415.jpg | Not published: identifiable people performing a test. |
| 8 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/c3b93667-0d50-4b04-857c-3ffea4df443f.jpg | Not published: a person is visible in the laboratory background. |
| 9 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/da4398a7-7736-4a4b-8c95-7cd7e3f64bfa.jpg | Not published: multiple identifiable people and station/customer identifiers. |
| 10 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/b8ab7423-0de6-4a32-9e09-f678feb80a4c.jpg | Not published: identifiable people and third-party charger branding. |
| 11 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/399f9076-e146-4194-9902-6b853bd20c9b.jpg | Approved; reuse existing local asset. |
| 12 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/5be56a20-814c-4da8-87b4-a09a9e0dda79.jpeg | Not published: person, parked vehicles/plates and third-party markings in the scene. |
| 13 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/b84970f2-8189-4e6b-9d3f-a71b4565ad8a.jpg | Not published: a person is visible at the left of the equipment. |
| 14 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/4721b8ae-e843-4ea4-9b1e-d716388499b7.png | Approved; reuse existing local asset. |
| 15 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/a5e00188-9569-4ea1-9048-e78b7d063da5.jpg | Not published: identifiable person, vehicle badge and readable plate. |
| 16 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/a9c52b35-3380-45de-82b6-08dacd876af2.jpg | Not published: customer vehicle badge and plate area; pre-existing source blur does not resolve attribution risk. |
| 17 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/3e3d811e-f012-4c1a-8152-c32e6a083576.png | Not published: customer marks/identifiers are present on production-line panels, partly blurred in the source original. |
| 18 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/eba988f1-5e8a-459c-8f36-aee774395581.png | Not published: prominent third-party charger/manufacturer branding. |

## Additional Body Images

| Case | Original body image | Decision and reason |
| --- | --- | --- |
| 1 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/9a96a4b9-005b-41fe-927c-10c096c40ec9.jpg | Not published: visible person; the existing equipment-only case 1 image is preferable. |
| 14 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/2436af77-8be6-4752-adcb-ec66ca35fc2e.jpg | Not added: a second view of the same production line is unnecessary for a one-image-per-case interface. Keep the already approved image. |
| 17 | https://www.saiter.cn/__external/img-a/v/main1/cms/image/8575b923-1f54-4b1f-a909-eeeba0dc9871.jpg | Not published: visible person operating the equipment. |

No source photographs from the About page, customer logo wall, team portraits or honors section were copied. Case entries with no approved photograph should retain a text-led presentation rather than receive an unrelated illustration.
