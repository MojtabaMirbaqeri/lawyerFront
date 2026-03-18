import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import LawyerProfileEducationSection from "~/components/LawyerProfile/LawyerProfileEducationSection.vue";
import LawyerProfileLanguagesSection from "~/components/LawyerProfile/LawyerProfileLanguagesSection.vue";
import LawyerProfileContactSection from "~/components/LawyerProfile/LawyerProfileContactSection.vue";

const globalStubs = {
  LawyerProfileSectionCard: {
    template: "<section><slot /></section>",
  },
};

describe("Lawyer profile conditional sections", () => {
  it("renders education section only when data exists", () => {
    const emptyWrapper = mount(LawyerProfileEducationSection, {
      props: { items: [] },
      global: { stubs: globalStubs },
    });
    expect(emptyWrapper.text()).toBe("");

    const fullWrapper = mount(LawyerProfileEducationSection, {
      props: {
        items: [
          {
            id: 1,
            degree_text: "کارشناسی ارشد",
            university: "دانشگاه تهران",
            field_of_study: "حقوق خصوصی",
          },
        ],
      },
      global: { stubs: globalStubs },
    });
    expect(fullWrapper.text()).toContain("دانشگاه تهران");
  });

  it("renders languages section only when at least one language exists", () => {
    const emptyWrapper = mount(LawyerProfileLanguagesSection, {
      props: { items: [] },
      global: { stubs: globalStubs },
    });
    expect(emptyWrapper.text()).toBe("");

    const fullWrapper = mount(LawyerProfileLanguagesSection, {
      props: { items: ["فارسی", "انگلیسی"] },
      global: { stubs: globalStubs },
    });
    expect(fullWrapper.text()).toContain("فارسی");
    expect(fullWrapper.text()).toContain("انگلیسی");
  });

  it("renders contact links only for allowed populated links", () => {
    const wrapper = mount(LawyerProfileContactSection, {
      props: {
        links: {
          website: "https://example.com",
          linkedin: "",
          telegram: "https://t.me/test",
        },
      },
      global: { stubs: globalStubs },
    });

    expect(wrapper.text()).toContain("وب‌سایت");
    expect(wrapper.text()).toContain("تلگرام");
    expect(wrapper.text()).not.toContain("لینکدین");
  });
});
