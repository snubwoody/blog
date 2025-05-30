import { test, expect } from "@playwright/test";

// FIXME safari has very weird issues with cookies so turning it off
// for now, I will manually verify them on my phone.

test("data-theme attribute", async({page}) => {
    await page.goto("http://localhost:4321");
    await expect(page.locator("html")).toHaveAttribute("data-theme","light");
});

test("theme cookie defaults to light mode", async ({ page,context,browserName }) => {
    await page.goto("http://localhost:4321");
    
    const cookies = await context.cookies();
    const theme = cookies.find(cookies => cookies.name == "theme");

    if(browserName === "webkit"){
        return;
    }
    
    expect(theme?.secure).toBe(true);
    expect(theme?.value).toBe("light");
    expect(theme?.sameSite).toBe("Strict");
    expect(theme?.httpOnly).toBe(false);
});

test("theme endpoint sets cookie", async ({ page,context,browserName }) => {
    await page.goto("http://localhost:4321");

    if(browserName === "webkit"){
        return;
    }

    const status = await page.evaluate(async () => {
        const body = {
            theme: "dark"
        };

        const response = await fetch("http://localhost:4321/api/theme",{
            method:"POST",
            body: JSON.stringify(body),
            headers: {"content-type":"application/json"}
        });
        return response.status;
    });


    expect(status).toBe(200);

    const cookies = await context.cookies();
    const theme = cookies.find(cookies => cookies.name == "theme");
    
    expect(theme?.value).toBe("dark");
    expect(theme?.secure).toBe(true);
    expect(theme?.sameSite).toBe("Strict");
    expect(theme?.httpOnly).toBe(false);
});

test("theme cookie persists", async ({ page,context,browserName }) => {
    await page.goto("http://localhost:4321");

    await page.evaluate(async () => {
        const body = {
            theme: "dark"
        };

        await fetch("http://localhost:4321/api/theme",{
            method:"POST",
            body: JSON.stringify(body),
            headers: {"content-type":"application/json"}
        });
    });

    if (browserName !== "webkit"){
        const cookies = await context.cookies();
        const theme1 = cookies.find(cookies => cookies.name == "theme");
        
        expect(theme1?.value).toBe("dark");
        await page.reload();
        
        const theme = (await context.cookies()).find(cookie => cookie.name == "theme");
        expect(theme?.value).toBe("dark");
    }
});
