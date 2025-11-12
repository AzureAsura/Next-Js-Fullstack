// import NextAuth from 'next-auth'
// import GitHub from "next-auth/providers/github"
// import { client } from "./sanity/lib/client"
// import { AUTHOR_BY_GITHUB_ID_QUERY } from "./lib/queris"
// import { writeClient } from "./sanity/lib/write-client"

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [GitHub],
//   callbacks: {
//     async signIn({
//       user: { name, email, image },
//       profile: { id, login, bio },
//     }) {
//       const existingUser = await client
//         .withConfig({ useCdn: false })
//         .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
//           id,
//         });

//       if (!existingUser) {
//         await writeClient.create({
//           _type: "author",
//           id,
//           name,
//           username: login,
//           email,
//           image,
//           bio: bio || "",
//         });
//       }

//       return true;
//     },


//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         const user = await client
//           .withConfig({ useCdn: false })
//           .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
//             id: profile?.id,
//           });

//         token.id = user?._id;
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       Object.assign(session, { id: token.id });
//       return session;
//     },
//   }
// })

import NextAuth from 'next-auth'
import GitHub from "next-auth/providers/github"
import { client } from "./sanity/lib/client"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./lib/queris"
import { writeClient } from "./sanity/lib/write-client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, profile }) {
      // Pastikan profile ada dan cast ke tipe yang benar
      if (!profile) return false;

      const githubProfile = profile as {
        id?: number;
        login?: string;
        bio?: string;
      };

      // Gunakan id dari profile atau email sebagai fallback
      const githubId = githubProfile.id?.toString() || profile.email || user.email;
      const username = githubProfile.login || user.name?.toLowerCase().replace(/\s+/g, '-');

      if (!githubId) {
        console.error('No GitHub ID available');
        return false;
      }

      try {
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: githubId,
          });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id: githubId,
            name: user.name || '',
            username: username || '',
            email: user.email || '',
            image: user.image || '',
            bio: githubProfile.bio || "",
          });
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const githubProfile = profile as {
          id?: number;
        };

        const githubId = githubProfile.id?.toString() || profile.email || token.email;

        if (githubId) {
          try {
            const user = await client
              .withConfig({ useCdn: false })
              .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                id: githubId,
              });

            if (user) {
              token.id = user._id;
            }
          } catch (error) {
            console.error('Error fetching user in jwt callback:', error);
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        Object.assign(session, { id: token.id });
      }
      return session;
    },
  }
})