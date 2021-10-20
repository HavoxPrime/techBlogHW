async function commentFormHandler(e) {
  e.preventDefault();

  const commentContent = document
    .querySelector('input[name="comment-body"]')
    .value.trim();

  const blogId = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  if (commentContent) {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        commentContent,
        blogId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
      document.querySelector("#comment-form").style.display = "block";
    }
  }
}

document
  .querySelector(".comment-form")
  .addEventListener("submit", commentFormHandler);
